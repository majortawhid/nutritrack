const mongoose = require('mongoose');

const nutrientSchema = new mongoose.Schema({
  protein: { type: Number, min: 0, default: 0 },
  carbs: { type: Number, min: 0, default: 0 },
  fats: { type: Number, min: 0, default: 0 },
  vitaminA: { type: Number, min: 0, default: 0 }, // mcg
  vitaminC: { type: Number, min: 0, default: 0 }, // mg
  calcium: { type: Number, min: 0, default: 0 }, // mg
  iron: { type: Number, min: 0, default: 0 }, // mg
  potassium: { type: Number, min: 0, default: 0 }, // mg
  magnesium: { type: Number, min: 0, default: 0 } // mg
});

const foodSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Protein', 
      'Vegetable', 
      'Fruit', 
      'Grain', 
      'Dairy', 
      'Legume', 
      'Nut', 
      'Other'
    ]
  },
  servingSize: {
    type: String,
    required: true,
    trim: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  nutrients: {
    type: nutrientSchema,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: Date
});

// Update timestamp before saving
foodSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Text index for search
foodSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Food', foodSchema);