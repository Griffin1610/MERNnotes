const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { noteschema } = require('./schema');


//initialize express server
const app = express();

const PORT = process.env.PORT || 5000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

app.listen(PORT, (error) => { 
    if(!error){
        console.log("Server is running on port " + PORT)
    }
    else {
        console.log("Error occured, server cannot start")
    }})

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

//receive note
app.post("/notes", async (request, response) => {
    try {
    const schema = new mongoose.Schema(noteschema);
    const note = mongoose.model('Note', noteschema);
    const newNote = new note(request.body);
    await newNote.save();
    console.log(request.body);
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



//initalize MongoDB connection
mongoose.connect(DB_CONNECTION_STRING)
.then(() => console.log('Connected to yourDB-name database'))
.catch((err) => console.log('Error connecting to database', err));