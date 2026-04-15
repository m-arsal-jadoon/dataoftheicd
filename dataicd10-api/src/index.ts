/**
 * Cloudflare Worker for DataICD10 Search API
 * Designed for pure Edge execution (<50ms latency) via global KV caching.
 */

export interface Env {
  // Binding to the Cloudflare KV namespace defined in wrangler.toml
  ICD10_KV: KVNamespace;
}

// ==============================================================
// ISOLATE GLOBAL MEMORY CACHE (Retained Across Requests)
// ==============================================================
let cachedIndex: any[] | null = null;

// ==============================================================
// EDGE FUZZY ENGINE (No 8MB node_modules Dependencies)
// ==============================================================
function calculateRelevanceScore(target: string, queryWords: string[]): number {
  if (!target || queryWords.length === 0) return 0;
  const t = target.toLowerCase();
  let score = 0;
  
  for (const word of queryWords) {
      if (t.includes(word)) {
          // Weight exact literal matches heavily
          score += (word.length * 10);
      }
  }
  return score;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS Wrapper Mapping 
    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const q = url.searchParams.get("q");

    if (!q) {
        return new Response(JSON.stringify({ results: [] }), { headers: corsHeaders });
    }

    // ==============================================================
    // CACHE HYDRATION (Only impacts the very first user interaction)
    // ==============================================================
    if (!cachedIndex) {
        try {
            // Fetch as text to control parsing execution precisely inside the instance memory block
            const rawKVText = await env.ICD10_KV.get('full_index', 'text');
            
            if (!rawKVText) {
                return new Response(JSON.stringify({ error: "KV_DATA_NOT_FOUND", results: [] }), { headers: corsHeaders, status: 500 });
            }
            
            const rawKVData = JSON.parse(rawKVText);
            
            if (Array.isArray(rawKVData)) {
                cachedIndex = rawKVData;
            } else if (typeof rawKVData === 'object') {
                cachedIndex = Object.values(rawKVData);
            } else {
                cachedIndex = [];
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: "KV Offline or Missing Data", results: [] }), { headers: corsHeaders, status: 500 });
        }
    }

    // Attach Dynamic Debug Headers
    corsHeaders["X-Debug-Index-Size"] = cachedIndex ? cachedIndex.length.toString() : "0";

    // Safely prevent empty crashes
    if (!cachedIndex || cachedIndex.length === 0) {
         return new Response(JSON.stringify({ results: [], msg: "Awaiting KV Population" }), { headers: corsHeaders });
    }

    // ==============================================================
    // MULTI-WORD INDEX SCAN & MAP 
    // ==============================================================
    const query = q.toLowerCase().trim();
    const cleanQ = query.replace(/[^a-z0-9]/g, '');
    const queryWords = query.split(/\s+/).filter(w => w.length > 2);
    
    const isPotentialCode = cleanQ.length >= 3 && cleanQ.length <= 8;

    const matchedVectors = [];
    
    for (const item of cachedIndex) {
        // Fallback for object or array structures
        const isArr = Array.isArray(item);
        const codeOriginal = String(isArr ? item[0] : (item.code_id || ''));
        const titleOriginal = String(isArr ? item[1] : (item.title || ''));
        const isBillableVal = isArr ? Boolean(item[2]) : Boolean(item.is_billable);

        let score = 0;
        const codeClean = codeOriginal.toLowerCase().replace(/[^a-z0-9]/g, '');
        const titleStr = titleOriginal;

        // Priority 1: Exact Absolute Prefix Mapping (Handles: M5, M54, M54.5)
        if (isPotentialCode && codeClean.startsWith(cleanQ)) {
           if (codeClean === cleanQ) {
               score += 50000; // Perfect Code Matched
           } else {
               score += 1000 - (codeClean.length - cleanQ.length);
           }
        } 
        
        // Priority 2: Fuzzy Weight Map 
        score += calculateRelevanceScore(titleStr, queryWords);
        
        if (score > 0) {
           matchedVectors.push({ 
               // Front-end UI requires code_id, title, is_billable. Supplying dual-mapping for safety.
               item: {
                   code: codeOriginal,
                   code_id: codeOriginal,
                   title: titleOriginal,
                   billable: isBillableVal,
                   is_billable: isBillableVal
               }, 
               score, 
               matches: [] 
           }); 
        }
    }

    // Pre-Sort Array Highest Integer Match => Lowest limit arrays
    matchedVectors.sort((a, b) => b.score - a.score);
    const limitedPayload = matchedVectors.slice(0, 40);

    return new Response(JSON.stringify({ 
       results: limitedPayload, 
       didYouMean: limitedPayload.length === 0 && q.length > 3 // Simple heuristic 
    }), { 
        headers: corsHeaders 
    });
  }
};
