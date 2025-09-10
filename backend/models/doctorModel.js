// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  specialization: {
    type: String,
    required: true, // Example: "Cardiologist"
    unique: true
  },
  description: {
    type: String, // Small note e.g. "Heart & chest related issues"
  },
  commonSymptoms: [
    { type: String } // Example: ["Chest pain", "Shortness of breath"]
  ]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
