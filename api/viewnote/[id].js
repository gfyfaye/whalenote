import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { id } = req.query;

  const { data, error } = await supabase
    .from('notes')
    .select('content')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.log("Tried to find a nonexistent note :(");
    return res.status(404).json({ error: 'Note not found' });
  }

  console.log("note fetched! This is the note:, ", data.content);
  return res.status(200).json({ text: data.content });
}
