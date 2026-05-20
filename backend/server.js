const express = require('express');  // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors');  // Import CORS middleware to handle Cross-Origin Resource Sharing
const app = express();
const Note = require('./models/note');
app.use(cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to Mongoose'))
.catch((err) => console.error('Error connecting to Mongoose:', err));

app.get('/',(req,res)=> {
    res.send('Notes api is running');
});

app.post("/notes",async (req,res) => {
    try {
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } 
    catch (err) {
        res.status(500).json({ error: 'Failed to create note' });
    }
})

app.get("/notes", async (req,res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.delete("/notes/:id", async (req,res) => {
    try {
        await
        Note.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
})


app.put("/notes/:id", async (req,res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content
            },
            {new:true}
        );
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

const port=5000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});