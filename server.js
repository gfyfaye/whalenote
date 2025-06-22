const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const baseUrl = process.env.BASE_URL;

// save a note
app.post('/api/note', async (req, res) => {
  const content = req.body.text;
  const { data, error } = await supabase.from('notes').insert([{ content }]).select().single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save note' });
  }

  console.log("note saved!");
  const id = data.id;
  const link = `${baseUrl}/view/${id}`;
  return res.status(200).json({ link });
});

app.get('/api/viewnote/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('notes')
    .select('content')
    .eq('id', req.params.id)
    .single();

  if (error || !data) {
    console.log("Tried to find a nonexistent note :(")
    return res.status(404).json({ error: 'Note not found' });
  }
  console.log("note fetched! This is the note:, ", data.content);
  return res.status(200).json({ text: data.content });
});


app.use(express.static('src'));
app.use('/assets', express.static(__dirname + '/src/assets'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/main.html');
});
app.get('/view/:id', (req, res) => {
  res.sendFile(__dirname + '/src/main.html'); // This loads your frontend app
});

app.listen(3000, () => {
  console.log('💌 Love Note Server running at http://localhost:3000');
});
