// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
     maxlength: 50
  },
  email:{
    type: String,
    required: true,
    maxlength: 50
  },
  password:{
       type: String,
    required: true,
    minlength :6
  },
  specialization: {
    type: String,
    required: true,
    default:"General" // Example: "Cardiologist"
  
  },
  description: {
    type: String, // Small note e.g. "Heart & chest related issues"
  },
  commonSymptoms: [
    { type: String } // Example: ["Chest pain", "Shortness of breath"]
  ]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
