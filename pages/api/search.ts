import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
// Use flexsearch default Export
import FlexSearch from 'flexsearch';

// ----------------------------------------
// INVERTED INDEX - FLEXSEARCH (Memory Cache)
// ----------------------------------------
// Tokenized Index configured perfectly for Score ranking
// Tokenized Index configured perfectly for Score ranking
let flexIndex: any = null;
let memoryDb: any[] = [];
let dbLoaded = false;
const exactCodeMap = new Map<string, any>();

// ----------------------------------------
// MEDICAL SYNONYM MAP (Offloaded to Server)
// ----------------------------------------
const synonymMap: Record<string, string[]> = {
  // Common terms strictly mapped to clinical phrases
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

const getExtendedQuery = (query: string): string => {
  if (!query) return '';
  const lowerQ = query.toLowerCase().trim();
  let expandedTerms = [lowerQ];
  const words = lowerQ.split(' ');
  words.forEach(w => {
    if (synonymMap[w]) {
      expandedTerms = [...expandedTerms, ...synonymMap[w]];
    }
  });
  return expandedTerms.join(' '); 
};

// ----------------------------------------
// GOOGLE-STYLE RELEVANCY ENGINE
// ----------------------------------------
const computeGoogleScore = (item: any, query: string) => {
    if (!query) return 100; // Auto-100 for categorical direct clicks
    const q = query.toLowerCase().trim();
    const code = item.code_id.toLowerCase();
    const title = (item.title || '').toLowerCase();
    const incl = (item.inclusions || '').toLowerCase();
    
    const cleanQ = q.replace(/[^a-z0-9]/g, '');
    const cleanCode = code.replace(/[^a-z0-9]/g, '');
    
    if (cleanCode === cleanQ) return 100;
    if (title === q || title.includes(q)) return 90;
    if (incl.includes(q)) return 70;
    
    return 50; 
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.q as string || '').trim();
  const filter = req.query.filter as string;
  const billable = req.query.billable as string;
  const gender = req.query.gender as string;
  const age = req.query.age as string;
  
  if (!dbLoaded || !flexIndex || memoryDb.length === 0) {
      try {
          const dbPath = path.join(process.cwd(), 'data', 'search-index.json');
          if (fs.existsSync(dbPath)) {
              const rawData = fs.readFileSync(dbPath, 'utf8');
              const arrDb = JSON.parse(rawData);
              
              memoryDb = arrDb.map((row: any) => ({
                  code_id: row[0],
                  title: row[1],
                  is_billable: !!row[2]
              }));
              
              flexIndex = new FlexSearch.Document({
                  preset: "score",    
                  tokenize: "forward", 
                  document: {
                      id: "code_id", 
                      index: ["code_id", "title"], 
                      store: true
                  }
              });
              
              memoryDb.forEach((item: any) => {
                 flexIndex.add(item);
                 const cCode = item.code_id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                 exactCodeMap.set(cCode, item);
              });
              
              dbLoaded = true;
          }
      } catch(e) {
          console.error(e);
          return res.status(500).json({ error: "Failed to initialize Tokenized Lexicon Index" });
      }
  }

  // INTERCEPT: Categorical Pure Filters bypassing FlexSearch text logic
  if (!query && (filter || billable || gender || age)) {
      let filteredArray = memoryDb;
      
      if (filter === 'new') filteredArray = filteredArray.filter(i => i.is_new);
      if (filter === 'deleted') filteredArray = filteredArray.filter(i => i.is_deleted);
      if (billable === 'true') filteredArray = filteredArray.filter(i => i.is_billable);
      if (gender) filteredArray = filteredArray.filter(i => i.gender === gender.toLowerCase());
      if (age) filteredArray = filteredArray.filter(i => i.age_group === age.toLowerCase());
      
      const payload = filteredArray.slice(0, 10).map(item => ({
         item,
         googleScore: 100
      }));
      return res.status(200).json({ results: payload });
  }

  if (!query || !flexIndex) {
      return res.status(200).json({ results: [] });
  }

  // ==============================================================
  // 4-TIER SEARCH SPEC ENGINE (Exact > Prefix > Keyword > Fuzzy)
  // ==============================================================
  const cleanQ = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isPotentialCode = cleanQ.length >= 3 && cleanQ.length <= 8;
  
  let exactMatch: any = null;
  let prefixMatches: any[] = [];
  let flexResultsMap = new Map();

  // Tier 1 & 2: Exact Match & Directed Prefix Walk
  if (isPotentialCode) {
      if (exactCodeMap.has(cleanQ)) {
          exactMatch = exactCodeMap.get(cleanQ);
      }

      memoryDb.forEach(item => {
          const codeStr = (item.code || item.code_id || '').toLowerCase();
          const cleanCode = codeStr.replace(/[^a-z0-9]/g, '');
          
          if (cleanCode.startsWith(cleanQ)) {
              prefixMatches.push(item);
          }
      });
  }

  // Tier 3 & 4: Keyword Directed & Lexicon Synonyms (FlexSearch)
  let expandedQuery = [query.toLowerCase()];
  query.toLowerCase().split(' ').forEach(w => {
      if (synonymMap[w]) expandedQuery.push(...synonymMap[w]);
  });
  
  expandedQuery.forEach(term => {
      if (!term) return;
      const rawResults = flexIndex.search(term, { enrich: true, limit: 120 });
      rawResults.forEach((fieldResult: any) => {
          fieldResult.result.forEach((docEntry: any) => {
              if (!flexResultsMap.has(docEntry.id)) {
                  // docEntry.doc contains the stored object in flexSearch.
                  flexResultsMap.set(docEntry.id, memoryDb.find(m => (m.code || m.code_id) === docEntry.id) || docEntry.doc);
              }
          });
      });
  });

  // Compose Final Prioritized Structure maintaining { item, googleScore } interface
  let finalPayload: any[] = [];
  let distinctIds = new Set<string>();

  const pushSafely = (item: any, score: number) => {
      if (!item) return;
      const id = item.code || item.code_id;
      if (!distinctIds.has(id)) {
          distinctIds.add(id);
          // Standardize mappings for index.tsx compatibility
          item.code_id = id; 
          item.title = item.short_title || item.title;
          item.is_billable = item.billable_flag !== undefined ? item.billable_flag : item.is_billable;
          item.plain_english_explanation = item.plain_english_explanation || 'No plain-English explanation available.';
          finalPayload.push({ item, googleScore: score });
      }
  };

  // [Pos 1] Tier 1: Absolute Exact Match
  if (exactMatch) pushSafely(exactMatch, 100);

  // [Pos 2+] Tier 2: Prefix Descendants (Sorted by shortest string length)
  prefixMatches.sort((a, b) => (a.code || a.code_id || '').length - (b.code || b.code_id || '').length);
  prefixMatches.forEach(item => pushSafely(item, 95));

  // [Pos rem] Tier 3 & 4: Relevant Context Text
  Array.from(flexResultsMap.values()).forEach(item => {
      pushSafely(item, 80);
  });

  // Re-apply standard filters to the final constructed array
  let mappedResults = finalPayload;
  if (filter === 'new') mappedResults = mappedResults.filter(i => i.item.is_new);
  if (filter === 'deleted') mappedResults = mappedResults.filter(i => i.item.is_deleted);
  if (billable === 'true') mappedResults = mappedResults.filter(i => i.item.is_billable);
  if (gender) mappedResults = mappedResults.filter(i => (i.item.gender || '').toLowerCase() === gender.toLowerCase());
  if (age) mappedResults = mappedResults.filter(i => (i.item.age_group || '').toLowerCase() === age.toLowerCase());

  return res.status(200).json({ results: mappedResults.slice(0, 10) });
}
