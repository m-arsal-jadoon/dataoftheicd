const fs = require('fs');
const path = require('path');

// 1. Paths
const TABULAR_JSON = path.join(__dirname, '../raw_data/icd10cm_tabular_2026.json');
const INDEX_JSON = path.join(__dirname, '../raw_data/icd10cm_index_2026.json');
const ORDER_JSON = path.join(__dirname, '../raw_data/icd10cm_order_2026.json');
const OUTPUT_DIR = path.join(process.cwd(), 'data');
const OUTPUT_JSON_PATH = path.join(process.cwd(), 'data', 'master_icd10.json');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("🚀 Initializing Pure Node Vercel JSON Pipeline Builder...");



async function build() {
    try {
        console.log("⏳ 1. Processing Order JSON (billable_flag)...");
        const billableMap = new Map();
        let orderParsedData = [];
        if (fs.existsSync(ORDER_JSON)) {
            orderParsedData = JSON.parse(fs.readFileSync(ORDER_JSON, 'utf-8'));
            orderParsedData.forEach(item => {
                const code = item.code.replace('.', '');
                billableMap.set(code, item.is_billable);
            });
            console.log(`✅ Loaded ${billableMap.size} order rules from JSON.`);
        }

        console.log("⏳ 2. Processing Index JSON (search_keywords)...");
        const indexMap = new Map();
        if (fs.existsSync(INDEX_JSON)) {
            const indexJsonResult = JSON.parse(fs.readFileSync(INDEX_JSON, 'utf-8'));
            const letters = Array.isArray(indexJsonResult.letter) 
                            ? indexJsonResult.letter 
                            : (indexJsonResult.letter ? [indexJsonResult.letter] : []);
            
            function extractTerms(node, contextPath = "") {
                if (!node) return;
                const title = node.title || "";
                const currentPath = contextPath ? `${contextPath} > ${title}` : title;
                
                if (node.code) {
                    const c = typeof node.code === 'string' ? node.code.replace('.', '') : (node.code._ || "").replace('.', '');
                    if (!indexMap.has(c)) indexMap.set(c, new Set());
                    indexMap.get(c).add(currentPath);
                }
                
                if (node.term) {
                    const children = Array.isArray(node.term) ? node.term : [node.term];
                    children.forEach(child => extractTerms(child, currentPath));
                }
            }

            letters.forEach(letter => {
                if (letter.mainTerm) {
                    const terms = Array.isArray(letter.mainTerm) ? letter.mainTerm : [letter.mainTerm];
                    terms.forEach(t => extractTerms(t, ""));
                }
            });
            console.log(`✅ Indexed structural relationships for ${indexMap.size} codes.`);
        }

        console.log("⏳ 3. Processing Tabular JSON (Main Engine)...");
        const tabularJsonResult = JSON.parse(fs.readFileSync(TABULAR_JSON, 'utf-8'));
        
        const CUSTOM_EDITS_PATH = path.join(OUTPUT_DIR, 'custom_edits.json');
        let customEdits = {};
        if (fs.existsSync(CUSTOM_EDITS_PATH)) {
            customEdits = JSON.parse(fs.readFileSync(CUSTOM_EDITS_PATH, 'utf-8'));
        }

        const masterDatabase = [];
        const root = tabularJsonResult['ICD10CM.tabular'] || tabularJsonResult['ICD10CM.tabular_2026'] || tabularJsonResult['ICD10CM.tabular_2025'];
        const chapters = Array.isArray(root.chapter) ? root.chapter : [root.chapter];

        chapters.forEach(chapter => {
            const chapterId = chapter.name;
            const chapterDesc = chapter.desc;
            const sections = Array.isArray(chapter.section) ? chapter.section : (chapter.section ? [chapter.section] : []);

            sections.forEach(section => {
                const sectionDesc = section.desc;
                const sectionId = section.id || sectionDesc.match(/\((.*?)\)/)?.[1] || "Unknown";
                const diags = Array.isArray(section.diag) ? section.diag : (section.diag ? [section.diag] : []);

                function processDiag(diagNode, parentId = null) {
                    const code = diagNode.name.replace('.', '');
                    const desc = diagNode.desc;
                    
                    let exc1 = []; if (diagNode.excludes1 && diagNode.excludes1.note) exc1 = Array.isArray(diagNode.excludes1.note) ? diagNode.excludes1.note : [diagNode.excludes1.note];
                    let exc2 = []; if (diagNode.excludes2 && diagNode.excludes2.note) exc2 = Array.isArray(diagNode.excludes2.note) ? diagNode.excludes2.note : [diagNode.excludes2.note];
                    let incArr = []; if (diagNode.inclusionTerm && diagNode.inclusionTerm.note) incArr = Array.isArray(diagNode.inclusionTerm.note) ? diagNode.inclusionTerm.note : [diagNode.inclusionTerm.note];

                    const words = desc.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 3);
                    
                    const childNodes = Array.isArray(diagNode.diag) ? diagNode.diag : (diagNode.diag ? [diagNode.diag] : []);
                    const childIds = childNodes.map(c => c.name.replace('.', ''));
                    
                    // Priority 1: Billable map from Order Text. Priority 2: Leaf node assumption
                    const isBillable = billableMap.has(code) ? billableMap.get(code) : childNodes.length === 0;

                    let indexTerms = indexMap.has(code) ? Array.from(indexMap.get(code)) : [];
                    
                    const activeEdit = customEdits[code] || customEdits[diagNode.name] || {};

                    const record = {
                        code: diagNode.name, // keep dots natively
                        short_title: desc,
                        long_title: desc, // Note: CDC tabular mostly provides one desc length
                        billable_flag: isBillable,
                        chapter_range: sectionId,
                        chapter_title: chapterDesc,
                        category_code: diagNode.name.substring(0, 3),
                        parent_code: parentId,
                        includes_notes: incArr,
                        excludes1_notes: exc1,
                        excludes2_notes: exc2,
                        code_first_notes: [],
                        use_additional_code_notes: [],
                        fiscal_year: 2026,
                        effective_start_date: "2025-10-01",
                        effective_end_date: "2026-09-30",
                        source_file_version: "icd10cm_tabular_2026.xml",
                        slug: diagNode.name.toLowerCase().replace('.', '-'),
                        search_keywords: [...new Set([...words])],
                        related_index_terms: indexTerms,
                        plain_english_explanation: activeEdit.plain_english_explanation || null,
                        compare_targets: activeEdit.compare_targets || (childIds.length > 0 ? childIds : (parentId ? [parentId] : [])),
                        visual_template_type: isBillable ? "standard_code_page" : "parent_node",
                        
                        // Legacy UI bindings
                        code_id: diagNode.name,
                        title: desc,
                        hierarchy_children: childIds,
                        inclusions: incArr.join(', ')
                    };

                    masterDatabase.push(record);

                    childNodes.forEach(child => processDiag(child, diagNode.name));
                }

                diags.forEach(diag => processDiag(diag, null));
            });
        });

        console.log(`✅ Extracted ${masterDatabase.length} interconnected master records.`);

        // --- MERGE ORPHANED CODES FROM ORDER DATA ---
        if (orderParsedData && orderParsedData.length > 0) {
            const masterMap = new Map();
            masterDatabase.forEach(r => masterMap.set(r.code.replace('.', ''), r));
            let injectedCount = 0;
            
            orderParsedData.forEach(item => {
                const c = item.code.replace('.', '');
                if (!masterMap.has(c)) {
                    // find closest parent
                    let parent = null;
                    for(let i = c.length - 1; i >= 3; i--) {
                        let substr = c.substring(0, i);
                        if (masterMap.has(substr)) {
                            parent = masterMap.get(substr);
                            break;
                        }
                    }
                    
                    if (parent) {
                        const codeWithDot = c.length > 3 ? c.substring(0,3) + '.' + c.substring(3) : c;
                        const isBillable = item.is_billable === '1' || item.is_billable === true || item.is_billable === "true";
                        const words = item.short_description.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 3);
                        
                        const newRecord = {
                            ...parent,
                            code: codeWithDot,
                            short_title: item.short_description,
                            long_title: item.long_description,
                            title: item.short_description,
                            billable_flag: isBillable,
                            parent_code: parent.code,
                            slug: codeWithDot.toLowerCase().replace('.', '-'),
                            code_id: codeWithDot,
                            visual_template_type: isBillable ? "standard_code_page" : "parent_node",
                            hierarchy_children: [],
                            search_keywords: [...new Set([...words])],
                        };
                        masterDatabase.push(newRecord);
                        masterMap.set(c, newRecord);
                        
                        if (parent.hierarchy_children && Array.isArray(parent.hierarchy_children) && !parent.hierarchy_children.includes(codeWithDot)) {
                            parent.hierarchy_children.push(codeWithDot);
                        }
                        injectedCount++;
                    }
                }
            });
            console.log(`✅ Injected ${injectedCount} missing expanded leaf codes from Order data.`);
            console.log(`✅ Total final database records: ${masterDatabase.length}`);
        }

        fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(masterDatabase, null, 2));
        console.log(`💾 Master JSON Compiled Successfully at: ${OUTPUT_JSON_PATH}`);

    } catch (e) {
        console.error("FATAL BUILD ERROR:", e);
    }
}

build();
