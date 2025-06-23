import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const baseUrl = process.env.BASE_URL;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const content = req.body.text;

        const { data, error } = await supabase
            .from('notes')
            .insert([{ content }])
            .select()
            .single();

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to save note' });
        }

        console.log("note saved!");
        const id = data.id;
        const link = `${baseUrl}/view/${id}`;
        return res.status(200).json({ link });
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
