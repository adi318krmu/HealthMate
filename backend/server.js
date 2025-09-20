const express= require('express')
const app= express()
const dotenv=require('dotenv')
dotenv.config();
const cors = require('cors')
const connectDB= require('./models/dbconnect')
 connectDB();
const port = process.env.PORT || 3000
app.use(express.json())
app.use(cors())

const authRoute = require('./routes/authRoute')
const doctorRoute=require('./routes/doctorRoute')
// user authentication 
app.use('/api/auth', authRoute)

// doctor authentication
app.use('/api/doc',doctorRoute)
// for checking 
app.get("/",(req, res)=>{
    res.send("Chl rha hai bhai")
})
app.listen(port, ()=>{
    console.log(`running on port : ${port}`)
})