const fs = require('fs');
const Fuse = require('fuse.js');

const dbPath = './data/mini_index.json';
const rawData = fs.readFileSync(dbPath, 'utf8');
const memoryDb = JSON.parse(rawData);

const myIndex = Fuse.createIndex(['code_id', 'title', 'plain_english_explanation'], memoryDb);
const fuse = new Fuse(memoryDb, {
  includeScore: true,
  includeMatches: true,
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: true,
  keys: [
    { name: 'code_id', weight: 1.0 },
    { name: 'title', weight: 0.7 },
    { name: 'plain_english_explanation', weight: 0.5 }
  ]
}, myIndex);

// Test 1: standard
console.time('search-standard');
const results1 = fuse.search('Heart transplant heart failure');
console.timeEnd('search-standard');

// Test 2: extended exact words
const q = 'Heart transplant heart failure'.split(' ').map(w => `'${w}`).join(' ');
console.time('search-extended');
const results2 = fuse.search(q);
console.timeEnd('search-extended');

console.log(results1[0]);
console.log(results2[0]);
