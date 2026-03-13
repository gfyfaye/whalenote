const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'notes.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(FILE);
    } catch (err) {
      await fs.writeFile(FILE, JSON.stringify([]), 'utf8');
    }
  } catch (err) {
    // bubble up
    throw err;
  }
}

async function readAll() {
  await ensureDataFile();
  const raw = await fs.readFile(FILE, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeAll(arr) {
  await ensureDataFile();
  await fs.writeFile(FILE, JSON.stringify(arr, null, 2), 'utf8');
}

async function saveNote(content) {
  const notes = await readAll();
  const note = {
    id: uuidv4(),
    content: content,
    inserted_at: new Date().toISOString(),
  };
  notes.push(note);
  await writeAll(notes);
  return note;
}

async function getNoteById(id) {
  const notes = await readAll();
  return notes.find(n => String(n.id) === String(id)) || null;
}

module.exports = { saveNote, getNoteById };
