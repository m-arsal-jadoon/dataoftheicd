const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const inputPath = path.join(__dirname, '../icd10cm_index_2026.xml');
const outputPath = path.join(__dirname, '../icd10cm_index_2026.json');

console.log("Reading icd10cm_index_2026.xml (this may take a few seconds)...");

try {
    const xmlData = fs.readFileSync(inputPath, 'utf-8');
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.error("❌ Failed to parse Index XML:", err);
            return;
        }
        
        console.log("✅ XML Parsed. Formatting and writing to icd10cm_index_2026.json...");
        
        // Extract the root structure to keep JSON clean
        const rootData = result['ICD10CM.index'] || result;
        
        fs.writeFileSync(outputPath, JSON.stringify(rootData, null, 2));
        console.log("💾 Done! Conversion complete.");
    });
} catch (err) {
    console.error("❌ Error reading the file:", err);
}
