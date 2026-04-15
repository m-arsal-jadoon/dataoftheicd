const fs = require('fs');
const path = require('path');

async function upload() {
    const ACCOUNT_ID = "bf99955f3f17a7b2895f68313b1d9239";
    const NAMESPACE_ID = "d724421cc3f1425ab901b6a5472bb598";
    const API_TOKEN = "cfut_Q9crJlNmS8m1VmHiNsaRAJFusW2S4I4sGujz1hLg7850303c";
    const KEY_NAME = "full_index";
    const FILE_PATH = path.join(__dirname, '../data/search-index.json');

    console.log("🚀 Reading file...");
    const data = fs.readFileSync(FILE_PATH, 'utf8');

    console.log("📤 Uploading to Cloudflare KV...");
    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${KEY_NAME}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: data
    });

    if (response.ok) {
        console.log("✅ SUCCESS! Data pushed to Cloudflare Edge.");
    } else {
        const err = await response.text();
        console.error("❌ FAILED:", err);
    }
}

upload();