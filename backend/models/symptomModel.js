// models/Symptom.js
const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
  },
  relatedConditions: [
    {
      type: String, // e.g., "Fever", "COVID-19", "Flu"
    }
  ],
  severity: {
    type: String,
    enum: ["Low", "Moderate", "High", "Critical"],
    default: "Low"
  },
  remedies: [
    {
      type: String, // e.g., "Drink water", "Rest", "Paracetamol"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Symptom', symptomSchema);
