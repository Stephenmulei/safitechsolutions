import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const MESSAGES_FILE = path.join(__dirname, 'messages.json');
if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, '[]', 'utf8');

// Save a contact message
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  const entry = {
    id: Date.now(),
    name,
    email,
    subject: subject || '',
    message,
    receivedAt: new Date().toISOString()
  };

  try {
    const current = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8') || '[]');
    current.push(entry);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(current, null, 2), 'utf8');
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to save message:', err);
    return res.status(500).json({ error: 'Failed to save message' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, message: "Login successful" });
  }
  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Get messages (admin)
app.get('/api/admin/messages', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const current = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8') || '[]');
    return res.json(current);
  } catch (err) {
    console.error('Failed to read messages:', err);
    return res.status(500).json({ error: 'Failed to read messages' });
  }
});

// Delete a message by id (admin)
app.delete('/api/admin/messages/:id', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const current = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8') || '[]');
    const newMessages = current.filter(msg => msg.id !== parseInt(req.params.id, 10));

    if (newMessages.length === current.length) {
      return res.status(404).json({ error: 'Message not found' });
    }

    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(newMessages, null, 2), 'utf8');
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete message:', err);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
