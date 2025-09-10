const express= require('express')
const app= express()
const dotenv=require('dotenv')
dotenv.config();
const cors = require('cors')

const port = process.env.PORT || 3000
app.use(express.json())
app.use(cors())

const authRoute = require('./routes/authRoute')

// user authentication 
app.post('/api', authRoute)

// for checking 
app.get("/",(req, res)=>{
    res.send("Chl rha hai bhai")
})
app.listen(port, ()=>{
    console.log(`running on port : ${port}`)
})