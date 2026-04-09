const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data', 'master_icd10.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

// 1. Ensure public dir exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

console.log("🚀 Initializing Medical Sitemap Generator...");

if (!fs.existsSync(DB_PATH)) {
    console.error("❌ master_icd10.json not found! You must run build_database.js first.");
    process.exit(1);
}

// 2. Read Master DB
const rawData = fs.readFileSync(DB_PATH, 'utf-8');
const database = JSON.parse(rawData);

// Note: Base URL can be configured dynamically via VERCEL_URL or set specifically
const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://dataicd10.com'; 

// 3. Collect all URLs
const mainUrls = [];
const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
    { loc: '/', priority: '1.0', freq: 'weekly' },
    { loc: '/icd10cm/2026', priority: '0.9', freq: 'weekly' },
    { loc: '/about', priority: '0.5', freq: 'monthly' },
    { loc: '/contact', priority: '0.5', freq: 'monthly' },
    { loc: '/data-sources', priority: '0.5', freq: 'monthly' },
    { loc: '/disclaimer', priority: '0.5', freq: 'monthly' },
    { loc: '/privacy-policy', priority: '0.5', freq: 'monthly' },
    { loc: '/terms', priority: '0.5', freq: 'monthly' },
    { loc: '/search', priority: '0.8', freq: 'daily' }
];

staticRoutes.forEach(route => {
    mainUrls.push({
        loc: `${DOMAIN}${route.loc}`,
        lastmod: today,
        priority: route.priority,
        changefreq: route.freq
    });
});

const chaptersMap = new Set();
const sectionsMap = new Set();
const categoriesMap = new Set();
const codesUrls = [];

database.forEach(item => {
    let titleStr = Array.isArray(item.chapter_title) ? item.chapter_title.join(': ') : item.chapter_title;
    if (titleStr) {
        const match = String(titleStr).match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)$/);
        const chapterId = match ? match[1] : titleStr;
        if (chapterId) chaptersMap.add(chapterId);
    }
    
    if (item.chapter_range) {
        sectionsMap.add(item.chapter_range);
    }

    if (item.code_id && String(item.code_id).length === 3) {
        categoriesMap.add(item.code_id);
    }

    if (item.code_id) {
        const priority = item.billable_flag ? '0.8' : '0.6';
        const codeUrlPart = encodeURIComponent(String(item.code_id).toLowerCase().replace(/-/g, '.'));
        codesUrls.push({
            loc: `${DOMAIN}/icd10cm/2026/code/${codeUrlPart}`,
            lastmod: today,
            priority: priority,
            changefreq: 'yearly'
        });
    }
});

chaptersMap.forEach(id => {
    mainUrls.push({ loc: `${DOMAIN}/icd10cm/2026/chapter/${encodeURIComponent(id)}`, lastmod: today, priority: '0.8', changefreq: 'monthly' });
});

sectionsMap.forEach(id => {
    mainUrls.push({ loc: `${DOMAIN}/icd10cm/2026/section/${encodeURIComponent(id)}`, lastmod: today, priority: '0.7', changefreq: 'monthly' });
});

categoriesMap.forEach(id => {
    mainUrls.push({ loc: `${DOMAIN}/icd10cm/2026/category/${encodeURIComponent(id)}`, lastmod: today, priority: '0.6', changefreq: 'monthly' });
});

const allUrls = [...mainUrls, ...codesUrls];
const chunkSize = 40000;
const sitemaps = [];

for (let i = 0; i < allUrls.length; i += chunkSize) {
    const chunk = allUrls.slice(i, i + chunkSize);
    const sitemapId = i === 0 ? '' : `-${Math.floor(i / chunkSize)}`;
    const filename = `sitemap${sitemapId}.xml`;
    sitemaps.push(filename);
    
    let xmlBlocks = [];
    xmlBlocks.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    xmlBlocks.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
    
    chunk.forEach(u => {
        xmlBlocks.push(`  <url>`);
        xmlBlocks.push(`    <loc>${u.loc}</loc>`);
        xmlBlocks.push(`    <lastmod>${u.lastmod}</lastmod>`);
        xmlBlocks.push(`    <changefreq>${u.changefreq}</changefreq>`);
        xmlBlocks.push(`    <priority>${u.priority}</priority>`);
        xmlBlocks.push(`  </url>`);
    });
    
    xmlBlocks.push(`</urlset>`);
    
    fs.writeFileSync(path.join(PUBLIC_DIR, filename), xmlBlocks.join('\n'));
    console.log(`✅ Generated ${filename} with ${chunk.length} URLs.`);
}

if (sitemaps.length > 1) {
    // Generate sitemap index and rename initial sitemaps to avoid main overlap,
    // actually, let's keep it simple: index is sitemap.xml, others are sitemap-1.xml, sitemap-2.xml
    // Wait, let's do this cleaner: sitemap.xml is index, sitemap-0.xml, etc.
    let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const realSitemaps = [];
    
    // We already wrote them as sitemap.xml, sitemap-1.xml. 
    // If there's multiple chunks, sitemap.xml shouldn't be a urlset, it should be the index!
    for (let i = 0; i < sitemaps.length; i++) {
        const chunkFilename = `sitemap-chunk-${i}.xml`;
        const chunkToMove = sitemaps[i];
        fs.renameSync(path.join(PUBLIC_DIR, chunkToMove), path.join(PUBLIC_DIR, chunkFilename));
        realSitemaps.push(chunkFilename);
        indexXml += `  <sitemap>\n    <loc>${DOMAIN}/${chunkFilename}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;
    }
    indexXml += `</sitemapindex>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), indexXml);
    console.log(`✅ Generated index sitemap.xml linking to ${realSitemaps.length} chunks.`);
} else {
    // Just 1 sitemap (already sitemap.xml), so it's fine.
}

console.log(`✅ Success! Total URLs indexed: ${allUrls.length}`);
