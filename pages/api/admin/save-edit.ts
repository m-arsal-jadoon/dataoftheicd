export const runtime = 'edge';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code, plain_english_explanation, compare_targets } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    const editsPath = path.join(process.cwd(), 'database', 'custom_edits.json');
    let customEdits: Record<string, any> = {};

    if (fs.existsSync(editsPath)) {
       const fileContent = fs.readFileSync(editsPath, 'utf8');
       if (fileContent) {
           customEdits = JSON.parse(fileContent);
       }
    }

    if (!customEdits[code]) {
       customEdits[code] = {};
    }

    customEdits[code].plain_english_explanation = plain_english_explanation;
    
    // Ensure compare_targets is array
    if (typeof compare_targets === 'string') {
        customEdits[code].compare_targets = compare_targets.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(compare_targets)) {
        customEdits[code].compare_targets = compare_targets;
    }

    customEdits[code].updated_at = new Date().toISOString();

    fs.writeFileSync(editsPath, JSON.stringify(customEdits, null, 2), 'utf8');

    return res.status(200).json({ success: true, message: `Successfully saved edits for ${code}` });
  } catch (err: any) {
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}
