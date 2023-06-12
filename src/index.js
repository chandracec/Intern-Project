const express = require('express');
const app = express();
const route = require('../src/route/route')
app.use(express.json());
const mongoose = require('mongoose')

require('dotenv').config();

// const {PORT , MONGODB_CONNECT} = process.env;

mongoose.set('strictQuery' , true);

mongoose.connect(
    "mongodb+srv://chandrakant91550:85A3tszzv0FScC1w@cluster0.lcv0ktb.mongodb.net/intern?retryWrites=true&w=majority",
    { useNewUrlParser : true }
)
.then(()=>{
    console.log("Server Connected with MongoDb")
})
.catch((error)=>{
    console.log("Error in connection", error.message)
})

app.use('/',route);

app.listen(3000 , ()=>{
    console.log(`Server running at 3000`)
})

