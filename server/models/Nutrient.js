const mongoose = require('mongoose');

const nutrientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['macronutrient', 'micronutrient']
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'mg', 'mcg', 'IU']
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  rda: {
    male: Number,
    female: Number,
    unit: String
  },
  upperLimit: Number,
  functions: [String],
  deficiencySymptoms: [String],
  foodSources: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Nutrient', nutrientSchema);