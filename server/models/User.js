const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  profile: {
    age: { 
      type: Number,
      min: 18,
      max: 120 
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    weight: {
      type: Number,
      min: 30,
      max: 300 // kg
    },
    height: {
      type: Number,
      min: 100,
      max: 250 // cm
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very-active']
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: Date
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password verification method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);