const express= require('express')
const app= express()
const dotenv=require('dotenv')
dotenv.config();
const port = process.env.PORT || 3000

app.get("/",(req, res)=>{
    res.send("Chl rha hai bhai")
})
app.listen(port, ()=>{
    console.log(`running on port : ${port}`)
})