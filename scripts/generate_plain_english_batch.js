const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/master_icd10.json');
const OUTPUT_PATH = path.join(__dirname, '../database/master_icd10.json');

const DICTIONARY = {
  'laceration': 'A deep cut or tear in the skin.',
  'sequela': 'A condition that is a consequence of a previous disease or injury.',
  'unspecified': "A general diagnosis where the exact detail isn't fully defined yet.",
  'chronic': 'A long-lasting condition that persists for a long time.',
  'acute': 'A condition that starts suddenly and is usually severe but short-lived.',
  'congenital': 'A condition that is present from birth.',
  'benign': 'A condition, tumor, or growth that is not cancerous.',
  'malignant': 'A cancerous tumor or condition.',
  'hypertension': 'Chronically high blood pressure.',
  'diabetes': 'A condition affecting how your body uses blood sugar.',
  'infection': 'An invasion of body tissues by disease-causing agents.',
  'fracture': 'A medical condition where a bone is cracked or broken.',
  'sprain': 'A stretching or tearing of ligaments in a joint.',
  'strain': 'An injury to a muscle or a tendon.',
  'contusion': 'A clinical term for a bruise.',
  'edema': "Swelling caused by excess fluid trapped in the body's tissues.",
  'subsequent': 'Happening after the initial medical encounter or injury.',
  'initial': 'The very first medical encounter for this specific condition.',
  'closed': 'An injury where the skin is not broken open.',
  'open': 'An injury where the skin has been torn or broken.',
  'displaced': 'A bone break where the pieces have shifted out of their normal alignment.',
  'nondisplaced': 'A bone break where the pieces remain aligned.'
};

function translateToPlainEnglish(title) {
    if (!title) return "A specific clinical condition or injury.";
    const lowerTitle = title.toLowerCase();
    
    let explanations = [];
    
    // Check vocabulary against the clinical title
    for (const [term, meaning] of Object.entries(DICTIONARY)) {
        if (lowerTitle.includes(term)) {
            explanations.push(meaning);
        }
    }
    
    if (explanations.length > 0) {
        // Construct a 1-2 sentence paragraph from discovered mappings
        return `This code generally refers to: ${explanations.join(' ')}`;
    }
    
    return `A clinical diagnosis related to: ${title}.`;
}

console.log("🚀 Starting Plain-English Data Engineering Pipeline...");

try {
    const rawData = fs.readFileSync(DB_PATH, 'utf-8');
    const masterDb = JSON.parse(rawData);

    console.log(`Loaded ${masterDb.length} codes. Processing entire dataset globally...`);
    const batchList = masterDb;

    // 2. The Translator mapping
    const processedBatch = batchList.map(item => {
        const titleToUse = item.short_title || item.title || "";
        const plainEnglish = translateToPlainEnglish(titleToUse);
        
        return {
            ...item,
            plain_english_explanation: plainEnglish
        };
    });

    // 3. Output Generation
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(processedBatch, null, 2));
    console.log(`💾 Successfully overwritten master_icd10.json with ${processedBatch.length} Plain-English translations!`);

    // 4. Verification Output
    console.log("\\n--- 🔍 VERIFICATION SAMPLES ---");
    // Pick 5 random items that actually hit our dictionary to show quality
    const richItems = processedBatch.filter(i => i.plain_english_explanation.includes('This code generally refers to:'));
    
    for (let i = 0; i < 5; i++) {
        // Fallback to random items if not enough dictionary hits
        const pool = richItems.length >= 5 ? richItems : processedBatch;
        const randomIdx = Math.floor(Math.random() * pool.length);
        const sample = pool[randomIdx];
        console.log(`📌 Code: ${sample.code || sample.code_id}`);
        console.log(`🩺 Clinical Title: ${sample.short_title || sample.title}`);
        console.log(`🗣️  Plain English: ${sample.plain_english_explanation}\\n`);
    }

} catch (error) {
    console.error("FATAL ERROR generating script:", error);
}
