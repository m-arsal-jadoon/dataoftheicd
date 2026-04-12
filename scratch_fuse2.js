const fs = require('fs');
const Fuse = require('fuse.js');

const dbPath = './data/mini_index.json';
const rawData = fs.readFileSync(dbPath, 'utf8');
const memoryDb = JSON.parse(rawData);

console.time('indexing');
const myIndex = Fuse.createIndex(['code_id', 'title'], memoryDb);
const fuse = new Fuse(memoryDb, {
  includeScore: true,
  threshold: 0.3,
  ignoreLocation: true,
  keys: [
    { name: 'code_id', weight: 1.0 },
    { name: 'title', weight: 0.7 }
  ]
}, myIndex);
console.timeEnd('indexing');

console.time('search-m54');
const res = fuse.search('m54', { limit: 50 });
console.timeEnd('search-m54');

console.time('search-heart');
const res2 = fuse.search('heart failure', { limit: 50 });
console.timeEnd('search-heart');
