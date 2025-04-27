import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/User.js';
import Food from './models/Food.js';
import Nutrient from './models/Nutrient.js';
import auth from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/nutritrack-react', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { email: user.email, id: user._id } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { email: user.email, id: user._id, profile: user.profile } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

app.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ email: user.email, profile: user.profile });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

app.put('/api/profile', auth, async (req, res) => {
  try {
    const { age, gender, weight, height, activityLevel } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { profile: { age, gender, weight, height, activityLevel } } },
      { new: true }
    );
    res.json(user.profile);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Food CRUD Endpoints
app.get('/api/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch foods' });
  }
});

app.post('/api/foods', auth, async (req, res) => {
  try {
    const foodData = { ...req.body, createdBy: req.userId };
    const food = new Food(foodData);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create food' });
  }
});

app.put('/api/foods/:id', auth, async (req, res) => {
  try {
    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      req.body,
      { new: true }
    );
    if (!food) {
      return res.status(404).json({ message: 'Food not found or unauthorized' });
    }
    res.json(food);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update food' });
  }
});

app.delete('/api/foods/:id', auth, async (req, res) => {
  try {
    const food = await Food.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId
    });
    if (!food) {
      return res.status(404).json({ message: 'Food not found or unauthorized' });
    }
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete food' });
  }
});

// Nutrition Calculator
app.get('/api/calculate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.profile) {
      return res.status(400).json({ message: 'Complete your profile first' });
    }

    const { age, gender, weight, height, activityLevel } = user.profile;
    
    // Same calculation logic as before
    let bmr = gender === 'male' 
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };
    
    const dailyCalories = bmr * activityMultipliers[activityLevel];
    const macros = {
      protein: Math.round((dailyCalories * 0.3) / 4),
      carbs: Math.round((dailyCalories * 0.45) / 4),
      fats: Math.round((dailyCalories * 0.25) / 9)
    };
    
    const micros = {
      vitaminA: gender === 'male' ? 900 : 700,
      vitaminC: 90,
      calcium: 1000,
      iron: gender === 'male' ? 8 : 18,
      potassium: 3500,
      magnesium: gender === 'male' ? 400 : 310
    };
    
    res.json({
      dailyCalories: Math.round(dailyCalories),
      macros,
      micros
    });
  } catch (error) {
    res.status(500).json({ message: 'Calculation failed' });
  }
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});