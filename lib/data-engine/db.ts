import fs from 'fs';
import path from 'path';
import { IcdCodeSchema } from './schema';

export interface RelationalIcdRecord extends IcdCodeSchema {
    code_id: string;
    title: string;
    parent_id: string | null;
    children_ids: string[];
    is_billable: boolean;
    chapter_id: string | string[];
    section_id: string;
    section_title: string | string[];
    inclusions: string | null;
    gender?: string | null;
    age_group?: string | null;
    is_new?: boolean;
    is_deleted?: boolean;
}

// In-Memory Global State for lightning-fast Next.js SSG
let masterDatabaseCache: RelationalIcdRecord[] | null = null;

export function getAllCodes(): RelationalIcdRecord[] {
    if (masterDatabaseCache) return masterDatabaseCache;
    
    try {
        // Points to the new CDC XML parsed database
        const dbPath = path.join(process.cwd(), 'data', 'master_icd10.json');
        if (fs.existsSync(dbPath)) {
            const dbContent = fs.readFileSync(dbPath, 'utf8');
            masterDatabaseCache = JSON.parse(dbContent);
        } else {
            console.error("Critical Error: database/master_icd10.json not found!");
            masterDatabaseCache = [];
        }
    } catch (e) {
        console.error("Critical Failure fetching DB", e);
        masterDatabaseCache = [];
    }
    
    return masterDatabaseCache || [];
}

/**
 * Precision lookup by CDC code_id
 */
export function fetchCodeBySlug(slug: string): RelationalIcdRecord | null {
    const codes = getAllCodes();
    return codes.find(c => c.code_id.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Returns strictly direct children defined by XML taxonomy
 */
export function getChildren(codeObj: RelationalIcdRecord): RelationalIcdRecord[] {
    const codes = getAllCodes();
    if (!codeObj.children_ids || codeObj.children_ids.length === 0) return [];
    
    return codeObj.children_ids
        .map(childId => codes.find(c => c.code_id === childId))
        .filter(Boolean) as RelationalIcdRecord[];
}

/**
 * Calculates siblings by looking up the Parent and extracting its other children
 */
export function getSiblings(codeObj: RelationalIcdRecord): RelationalIcdRecord[] {
    if (!codeObj.parent_id) return []; // Chapter roots don't have direct siblings via structural strict logic
    
    const codes = getAllCodes();
    const parentNode = codes.find(c => c.code_id === codeObj.parent_id);
    if (!parentNode) return [];
    
    return parentNode.children_ids
        .filter(childId => childId !== codeObj.code_id)
        .map(childId => codes.find(c => c.code_id === childId))
        .filter(Boolean) as RelationalIcdRecord[];
}

/**
 * A fallback mechanism that relates codes loosely by their 3-letter prefix
 * Just in case they are isolated
 */
export function getRelatedCodes(slug: string, limit: number = 100): RelationalIcdRecord[] {
  const codes = getAllCodes();
  if (!slug || slug.length < 3) return [];
  
  const categoryPrefix = slug.substring(0, 3).toUpperCase();
  
  const related = codes.filter(c => 
     c.code_id.toUpperCase().startsWith(categoryPrefix) && 
     c.code_id.toUpperCase() !== slug.toUpperCase()
  );
  
  return related.slice(0, limit);
}

/**
 * CRAWLER & BREADCRUMB ENGINE
 */
export function getAllChapters() {
  const codes = getAllCodes();
  const chaptersMap = new Map();
  // In ICD-10, chapter titles follow: "Certain infectious and parasitic diseases (A00-B99)"
  
  codes.forEach(c => {
    let titleStr = Array.isArray(c.chapter_title) ? c.chapter_title.join(': ') : c.chapter_title;
    if (titleStr) {
        const match = titleStr.match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)$/);
        const mainId = match ? match[1] : titleStr; 
        
        if (!chaptersMap.has(mainId)) {
            chaptersMap.set(mainId, {
                id: mainId,
                title: titleStr
            });
        }
    }
  });
  
  // Sort alphabetically by ID (A00-B99, C00-D49, etc.) to enforce official Chapter 1->21 flow
  return Array.from(chaptersMap.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export function getSubSectionsByChapter(mainChapterId: string) {
  const codes = getAllCodes();
  const sectionsMap = new Map();
  
  codes.forEach(c => {
    let titleStr = Array.isArray(c.chapter_title) ? c.chapter_title.join(': ') : c.chapter_title;
    const match = titleStr?.match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)$/);
    const mId = match ? match[1] : titleStr;
    
    if (mId?.toLowerCase() === mainChapterId.toLowerCase() && c.chapter_range) {
       if (!sectionsMap.has(c.chapter_range)) {
           sectionsMap.set(c.chapter_range, {
               id: c.chapter_range,
               // Fallback: Infer the title of a sub-section block from its root codes later if necessary, 
               // right now CDC just groups by `chapter_range` blocks (A00-A09).
           });
       }
    }
  });
  
  return Array.from(sectionsMap.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export function getCategoriesByChapter(chapterRange: string) {
  const codes = getAllCodes();
  const categoryMap = new Map();
  
  codes.forEach(c => {
    // Only fetch Root Categories (3-chars)
    if (c.chapter_range?.toLowerCase() === chapterRange.toLowerCase() && c.code_id.length === 3) {
      if (!categoryMap.has(c.code_id)) {
        categoryMap.set(c.code_id, c);
      }
    }
  });
  
  return Array.from(categoryMap.values());
}

export function getCodesByCategory(categoryCode: string) {
  const codes = getAllCodes();
  // Fetch everything strictly under this category 
  return codes.filter(c => c.category_code?.toLowerCase() === categoryCode.toLowerCase() && c.code_id.toLowerCase() !== categoryCode.toLowerCase());
}
