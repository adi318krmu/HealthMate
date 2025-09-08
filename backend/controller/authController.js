const User= require('../models/userModel')
const bcrypt= require('bcrypt')

// register 
const registerUser= async (req , res)=>{
   try{
    const { name , email, password}= req.body
     if(!name || ! email || ! password){
        return res.status(400).json({ message:"All field required"})
     }
     const isUser= await User.findOne(email)
     if(email){
        return res.status(400).json({message:"User exist"})
    
     }
   
     const salt = await bcrypt.genSalt(10)
     const hashPassword= await bcrypt.salt(hashPassword,password)
      const user = await create({
          name , 
          email,
          password: hashPassword
      })
      return res.status(200).json(user)
   }catch(error){
    return res.status(500).json({message:error.message})
   }
}

//login 
const loginUser= async( req , res)=>{
    try{
  const { name , email , password}= req.body
  const isExist= await User.findone(email)
  if(isExist){
    return res.status(400).json({message:"User Exist"})
  }

  const isMatch= await bcrypt.compare(password, user.password)
  if(!isMatch){
    return res.status(400).json({message:"Invalid Password"})
  }

  return res.status(200).json({message:"Login Successfully"})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}
module.exports= {registerUser, loginUser};