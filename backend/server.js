const express = require('express');
const app = express()

app.get('/', (req, res) => {
    res.send("root URL of server");
})
app.listen(3000, (error) => { 
    if(!error){
        console.log("Server is running on port " + PORT)
    }
    else {
        console.log("Error occured, server cannot start")
    }
})