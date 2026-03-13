const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
const path = require('path');

// Serve static frontend files from the public folder
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// For SPA routes, return main.html so client-side routing works (/ and /view/:id)
app.get(['/', '/view/:id'], (req, res) => {
  res.sendFile(path.join(publicDir, 'main.html'));
});

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

const { saveNote: saveNoteLocal, getNoteById } = require('./localStore');

// save a note (used by frontend at /api/note)
app.post('/api/note', async (req, res) => {
  try {
    const content = req.body.text;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Empty note' });

    if (supabase) {
      const { data, error } = await supabase.from('notes').insert([{ content }]).select().single();
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to save note' });
      }
      const id = data.id;
      const link = `${baseUrl}/view/${id}`;
      return res.status(200).json({ link });
    }

    // fallback: local JSON store
    const note = await saveNoteLocal(content);
    const link = `${baseUrl}/view/${note.id}`;
    return res.status(200).json({ link });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// view a note (used by frontend at /api/viewnote/:id)
app.get('/api/viewnote/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (supabase) {
      const { data, error } = await supabase.from('notes').select('content').eq('id', id).single();
      if (error || !data) {
        return res.status(404).json({ error: 'Note not found' });
      }
      return res.status(200).json({ text: data.content });
    }

    const note = await getNoteById(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    return res.status(200).json({ text: note.content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`💌 Love Note Server running at http://localhost:${PORT}`);
  });
}


module.exports = app;