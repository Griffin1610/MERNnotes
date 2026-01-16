const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
console.log(process.env.DB_CONNECTION_STRING);

const app = express();

const PORT = process.env.PORT || 3000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

//initialize express server
app.get('/', (req, res) => {
    res.send("root URL of server");
})

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

//initalize MongoDB connection
mongoose.connect(DB_CONNECTION_STRING)
.then(() => console.log('Connected to yourDB-name database'))
.catch((err) => console.log('Error connecting to database', err));