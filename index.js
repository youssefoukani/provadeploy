const express=require('express')
const app=express()
const cors = require('cors');
const mongoose=require('mongoose')
const authRoutes = require('./routes/authRoutes');
const dotenv=require('dotenv/config');
const cookieParser = require('cookie-parser');


app.use(cors())

app.use(express.json())
app.use(cookieParser());


app.use('/', authRoutes);








const connessioneDb= async()=>{
    try{
        await mongoose.connect(process.env.DBURI);
        console.log("db ok")
    }catch(err){
        console.log("errore connessione al db")
    }
}

app.listen(3000, () => {
    console.log("Server ok");
    connessioneDb()
});