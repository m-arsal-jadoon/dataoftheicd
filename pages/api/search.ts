export const runtime = 'edge';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import Fuse from 'fuse.js';

// ----------------------------------------
// INVERTED INDEX - FUSE.JS (Memory Cache)
// ----------------------------------------
// Use global namespace to preserve state across HMR & repeated API calls
const globalAny: any = global;

if (!globalAny.memoryDb) {
    globalAny.memoryDb = [];
    globalAny.fuseInstance = null;
    globalAny.dbLoaded = false;
    globalAny.exactCodeMap = new Map<string, any>();
}

// ----------------------------------------
// MEDICAL SYNONYM MAP (Offloaded to Server)
// ----------------------------------------
const synonymMap: Record<string, string[]> = {
  'sugar': ['diabetes', 'glucose', 'insulin', 'hyperglycemia', 'endocrine', 'mellitus'],
  'heart': ['cardiac', 'myocardial', 'cardio', 'coronary', 'atrial', 'ventricular', 'infarction', 'failure'],
  'chest': ['ribs', 'thorax', 'sternum', 'pectoral', 'respiratory', 'pleural', 'costal', 'pain'],
  'lung': ['pulmonary', 'bronchial', 'respiratory', 'pleural', 'alveolar', 'pneumonia'],
  'brain': ['cerebral', 'neurological', 'cranial', 'encephalopathy', 'meninges', 'cerebrovascular'],
  'stomach': ['gastric', 'gastrointestinal', 'abdomen', 'peptic', 'enteric'],
  'blood': ['hematologic', 'vascular', 'hemorrhage', 'anemia', 'plasma'],
  'kidney': ['renal', 'nephro', 'urinary', 'dialysis'],
  'liver': ['hepatic', 'cirrhosis', 'hepatitis']
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.q as string || '').trim();
  const filter = req.query.filter as string;
  const billable = req.query.billable as string;
  const gender = req.query.gender as string;
  const age = req.query.age as string;
  
  if (!globalAny.dbLoaded || !globalAny.fuseInstance || globalAny.memoryDb.length === 0) {
      try {
          const dbDataPath = path.join(process.cwd(), 'data', 'mini_index.json');
          const fuseIndexPath = path.join(process.cwd(), 'data', 'fuse-index.json');
          
          if (fs.existsSync(dbDataPath) && fs.existsSync(fuseIndexPath)) {
              const dbStats = fs.statSync(dbDataPath);
              const fuseStats = fs.statSync(fuseIndexPath);
              
              if (dbStats.size < 5120 || fuseStats.size < 5120) {
                  throw new Error("LFS_POINTER_DETECTED");
              }

              const rawData = fs.readFileSync(dbDataPath, 'utf8');
              const rawIndex = fs.readFileSync(fuseIndexPath, 'utf8');
              
              try {
                  globalAny.memoryDb = JSON.parse(rawData);
                  const parsedIndex = JSON.parse(rawIndex);
                  const myIndex = Fuse.parseIndex(parsedIndex);
                  
                  globalAny.fuseInstance = new Fuse(globalAny.memoryDb, {
                      includeScore: true,
                      includeMatches: true,
                      threshold: 0.35, 
                      ignoreLocation: true,
                      useExtendedSearch: true,
                      keys: [
                        { name: 'code_id', weight: 1.0 },
                        { name: 'title', weight: 0.7 }
                      ]
                  }, myIndex);
                  
                  globalAny.memoryDb.forEach((item: any) => {
                     const cCode = item.code_id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                     globalAny.exactCodeMap.set(cCode, item);
                  });
                  
                  globalAny.dbLoaded = true;
              } catch (parseError) {
                  console.error("Critical Failure parsing JSON search index database", parseError);
              }
          }
      } catch(e: any) {
          if (e?.message === "LFS_POINTER_DETECTED") {
              console.error("CRITICAL ERROR: LFS Pointer detected instead of actual JSON data. Manual upload required.");
          } else {
              console.error("Search API DB Init error:", e);
          }
          return res.status(500).json({ error: "Failed to initialize Tokenized Lexicon Index. Possible missing data." });
      }
  }

  // INTERCEPT: Categorical Pure Filters bypassing FlexSearch text logic
  if (!query && (filter || billable || gender || age)) {
      let filteredArray = globalAny.memoryDb;
      
      if (filter === 'new') filteredArray = filteredArray.filter(i => i.is_new);
      if (filter === 'deleted') filteredArray = filteredArray.filter(i => i.is_deleted);
      if (billable === 'true') filteredArray = filteredArray.filter(i => i.is_billable);
      if (gender) filteredArray = filteredArray.filter(i => i.gender === gender.toLowerCase());
      if (age) filteredArray = filteredArray.filter(i => i.age_group === age.toLowerCase());
      
      const payload = filteredArray.slice(0, 10).map(item => ({
         item,
         score: 0.0001
      }));
      return res.status(200).json({ results: payload });
  }

  if (!query || !globalAny.fuseInstance) {
      return res.status(200).json({ results: [] });
  }

  // ==============================================================
  // PREFIX EXACT + FUSE.JS ENGINE 
  // ==============================================================
  const cleanQ = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isPotentialCode = cleanQ.length >= 3 && cleanQ.length <= 8;
  
  let exactMatch: any = null;
  let prefixMatches: any[] = [];

  if (isPotentialCode) {
      if (globalAny.exactCodeMap.has(cleanQ)) {
          exactMatch = globalAny.exactCodeMap.get(cleanQ);
      }
      // Speed Optimization: If it's short like 'M54', do a rapid prefix walk before Fuse scanning!
      if (cleanQ.length <= 5) {
          prefixMatches = globalAny.memoryDb.filter((m: any) => {
             const c = (m.code_id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
             return c.startsWith(cleanQ);
          }).slice(0, 30);
      }
  }

  // To support multi-words better, split and use the extended search syntax 
  // if standard fuzzy doesn't yield high scores, but we just use pure query with typo tolerance
  let rawResults: any[] = [];
  let isDidYouMean = false;

  // Let Prefix take precedence. Limit Fuse to only compute if prefix is heavily lacking.
  if (prefixMatches.length < 20) {
      rawResults = globalAny.fuseInstance.search(query, { limit: 50 });
      if (rawResults.length === 0) {
          const looseFuse = new Fuse(globalAny.memoryDb, { threshold: 0.6, keys: ['code_id', 'title'], ignoreLocation: true });
          rawResults = looseFuse.search(query, { limit: 1 });
          if (rawResults.length > 0) isDidYouMean = true;
      }
  }
  
  let finalPayload: any[] = [];
  let distinctIds = new Set<string>();

  const pushSafely = (item: any, score: number, matches?: any[]) => {
      if (!item) return;
      const id = item.code || item.code_id;
      if (!distinctIds.has(id)) {
          distinctIds.add(id);
          // Standardize mappings for index.tsx compatibility
          item.code_id = id; 
          item.title = item.short_title || item.title;
          item.is_billable = item.billable_flag !== undefined ? item.billable_flag : item.is_billable;
          item.plain_english_explanation = item.plain_english_explanation || 'No plain-English explanation available.';
          finalPayload.push({ item, score, matches: matches || [] });
      }
  };

  // 1. Exact Absolute Code Match always pos 1
  if (exactMatch) {
      pushSafely(exactMatch, 0.0001); // 0.00 = perfect match score in Fuse
  }

  // 2. Prefix Matches Ranked Second
  prefixMatches.sort((a: any, b: any) => (a.code_id || '').length - (b.code_id || '').length);
  prefixMatches.forEach((pm: any) => {
      pushSafely(pm, 0.01);
  });

  // 3. Fuse Ranked Items
  rawResults.forEach((res: any) => {
      pushSafely(res.item, res.score, res.matches);
  });

  // Re-apply standard filters to the final constructed array
  let mappedResults = finalPayload;
  if (filter === 'new') mappedResults = mappedResults.filter(i => i.item.is_new);
  if (filter === 'deleted') mappedResults = mappedResults.filter(i => i.item.is_deleted);
  if (billable === 'true') mappedResults = mappedResults.filter(i => i.item.is_billable === true || i.item.billable_flag === true || i.item.billable_flag === "1");
  if (gender) mappedResults = mappedResults.filter(i => (i.item.gender || '').toLowerCase() === gender.toLowerCase());
  if (age) mappedResults = mappedResults.filter(i => (i.item.age_group || '').toLowerCase() === age.toLowerCase());

  // Limit frontend delivery top 40 array length max to prevent DOM rendering lag
  return res.status(200).json({ results: mappedResults.slice(0, 40), didYouMean: isDidYouMean });
}

