import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { noteschema } from './schema.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
const Note = mongoose.model('Note', noteschema);

//initalize MongoDB connection
mongoose.connect(DB_CONNECTION_STRING)
.then(() => console.log('Connected to yourDB-name database'))
.catch((err) => console.log('Error connecting to database', err));

//middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

//receive, set, update, delete notes
app.post("/notes", async (request, response) => {
    try {
        const newNote = new Note(request.body);
        await newNote.save();
        response.status(201).send(newNote);
        } catch (err) {
            console.error(err);
            response.status(500).send("Failed to save note")
    }
})

app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.send(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch notes");
  }
});

app.get("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");
    res.send(note);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch note");
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).send("Note not found");
    res.send(note);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update note");
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).send("Note not found");
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete note");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});