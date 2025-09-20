const express= require('express')
const router= express.Router();
const {registerDoc , loginDoc}=require('../controller/doctorController')
router.post('/register', registerDoc);
router.post('/login', loginDoc)
module.exports= router;