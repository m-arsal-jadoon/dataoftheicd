const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const inputPath = path.join(__dirname, '../icd10cm_tabular_2026.xml');
const outputPath = path.join(__dirname, '../icd10cm_tabular_2026.json');

console.log("Reading icd10cm_tabular_2026.xml...");

try {
    const xmlData = fs.readFileSync(inputPath, 'utf-8');
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.error("❌ Failed to parse Tabular XML:", err);
            return;
        }
        
        console.log("✅ XML Parsed. Formatting and writing to icd10cm_tabular_2026.json...");
        
        // Export the raw JSON structure exactly as it was translated
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log("💾 Done! Tabular Conversion complete.");
    });
} catch (err) {
    console.error("❌ Error running tabular script:", err);
}
