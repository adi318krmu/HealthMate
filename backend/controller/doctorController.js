// const Doctor=require('../models/doctorModel')
//  const bcrypt= require('bcrypt')

//  const registerDoc= async (req, res)=>{
//     try{
//         const {name, email , password}=req.body
//         if(!name || !email || !password){
//             return res.status(400).json({message:"All field required"})
//         }
//         const isUser= await Doctor.findOne({email})
//         if(isUser){
//             return res.status(400).json({message:"user exist"})
//         }
//       const salt = await bcrypt.genSalt(10)
//       const hashPassword = await bcrypt.hash(password,salt)
//         const newDoc= await Doctor.create({
//            name , 
//            email , 
//            password : hashPassword
//         })
//          return  res.status(200).json({message:"Register hogya doctor sahab"})
//     } catch(error){
//         return res.status(500).json({message:error.message})
//     }
//  }


//  const loginDoc= async ( req ,res)=>{
//     try{
//         const { name , email , password}= req.body
//         const isUser= await Doctor.findOne({email});
//             if(!isUser){
//                 return res.status(400).json({message:"User don't exist"})}

//             const CheckPass= await bcrypt.compare(password, isUser.password)
//             if(!CheckPass){
//                 return res.status(400).json({message:"Invalid Password"})
//             }

//             return res.status(200).json({message:"Login hogya doctor ji "})
//     }
//     catch(error){
//         return res.status(500).json({message:error.message})
//     }

//  }
 
//  module.exports= {registerDoc, loginDoc};
// const Doctor = require('../models/doctorModel')
// const bcrypt = require('bcrypt')

// // Register doctor
// const registerDoc = async (req, res) => {
//   try {
//     const { name, email, password } = req.body
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields required" })
//     }

//     // check if doctor already exists
//     const isUser = await Doctor.findOne({ email })
//     if (isUser) {
//       return res.status(400).json({ message: "Doctor already exists" })
//     }

//     // hash password
//     const salt = await bcrypt.genSalt(10)
//     const hashPassword = await bcrypt.hash(password, salt)

//     // create doctor
//     const newDoc = await Doctor.create({
//       name,
//       email,
//       password: hashPassword
//     })

//     return res.status(201).json({ message: "Register hogya doctor sahab", doctor: newDoc })
//   } catch (error) {
//     return res.status(500).json({ message: error.message })
//   }
// }

// // Login doctor
// const loginDoc = async (req, res) => {
//   try {
//     const { email, password } = req.body

//     const isUser = await Doctor.findOne({ email })
//     if (!isUser) {
//       return res.status(400).json({ message: "Doctor doesn't exist" })
//     }

//     const checkPass = await bcrypt.compare(password, isUser.password)
//     if (!checkPass) {
//       return res.status(400).json({ message: "Invalid password" })
//     }

//     return res.status(200).json({ message: "Login hogya doctor ji" })
//   } catch (error) {
//     return res.status(500).json({ message: error.message })
//   }
// }

// module.exports = { registerDoc, loginDoc }
const Doctor = require('../models/doctorModel')
const bcrypt = require('bcrypt')

// Register doctor
const registerDoc = async (req, res) => {
  try {
    const { name, email, password , specialization} = req.body
    if (!name || !email || !password || !specialization) {
      return res.status(400).json({ message: "All fields required" })
    }

    const isUser = await Doctor.findOne({ email })
    if (isUser) {
      return res.status(400).json({ message: "Doctor already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newDoc = await Doctor.create({
      name,
      email,
      password: hashPassword,
      specialization
    })

    console.log("Doctor Registered:", newDoc) // 👀 debug

    return res.status(201).json({ message: "Register hogya doctor sahab", doctor: newDoc })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Login doctor
const loginDoc = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    const isUser = await Doctor.findOne({ email })
    if (!isUser) {
      return res.status(400).json({ message: "Doctor doesn't exist" })
    }

    console.log("Password from body:", password) // 👀 debug
    console.log("Password in DB:", isUser.password) // 👀 debug

    const checkPass = await bcrypt.compare(password, isUser.password)
    if (!checkPass) {
      return res.status(400).json({ message: "Invalid password" })
    }

    return res.status(200).json({ message: "Login hogya doctor ji" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = { registerDoc, loginDoc }
