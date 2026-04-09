const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../icd10cm_order_2026.txt');
const outputPath = path.join(__dirname, '../icd10cm_order_2026.json');

console.log("Reading icd10cm_order_2026.txt...");
const data = fs.readFileSync(inputPath, 'utf-8');
const lines = data.split('\n');

const jsonArray = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().length === 0) continue;

    const orderNumber = line.substring(0, 5).trim();
    const code = line.substring(6, 13).trim();
    const isBillable = line.substring(14, 15) === '1';
    const shortDesc = line.substring(16, 76).trim();
    const longDesc = line.substring(77).trim();

    jsonArray.push({
        order_number: orderNumber,
        code: code,
        is_billable: isBillable,
        short_description: shortDesc,
        long_description: longDesc
    });
}

console.log(`Parsed ${jsonArray.length} records. Writing to icd10cm_order_2026.json...`);
fs.writeFileSync(outputPath, JSON.stringify(jsonArray, null, 2));
console.log("Done! Conversion complete.");
