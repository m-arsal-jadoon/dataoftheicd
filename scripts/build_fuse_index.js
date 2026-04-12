const fs = require('fs');
const Fuse = require('fuse.js');
const path = require('path');

console.log("Loading mini_index...");
const dbPath = path.join(__dirname, '..', 'data', 'mini_index.json');
const rawData = fs.readFileSync(dbPath, 'utf8');
const memoryDb = JSON.parse(rawData);

console.log("Creating Fuse Index (Optimized Keys)...");
// Removed plain_english_explanation to radically boost speed and cut index size
const myIndex = Fuse.createIndex(['code_id', 'title'], memoryDb);

console.log("Writing to disk...");
fs.writeFileSync(path.join(__dirname, '..', 'data', 'fuse-index.json'), JSON.stringify(myIndex.toJSON()));

console.log("Done! fuse-index.json created.");
