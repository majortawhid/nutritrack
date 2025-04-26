const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Load nutrition data
const nutrientsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'nutrients.json'), 'utf8'));

// API endpoints
app.get('/api/nutrients', (req, res) => {
  res.json(nutrientsData.nutrients);
});

app.get('/api/foods', (req, res) => {
  res.json(nutrientsData.foods);
});

app.get('/api/calculate/:age/:gender/:weight/:height/:activityLevel', (req, res) => {
  const { age, gender, weight, height, activityLevel } = req.params;
  
  // Calculate basic metabolic rate (BMR)
  let bmr = 0;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Apply activity level multiplier
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  };
  
  const dailyCalories = bmr * activityMultipliers[activityLevel];
  
  // Calculate macronutrient needs (simple version)
  const macros = {
    protein: Math.round((dailyCalories * 0.3) / 4), // 30% of calories, 4 calories per gram
    carbs: Math.round((dailyCalories * 0.45) / 4),  // 45% of calories, 4 calories per gram
    fats: Math.round((dailyCalories * 0.25) / 9)    // 25% of calories, 9 calories per gram
  };
  
  // Calculate micronutrient RDAs (simplified)
  const micros = {
    vitaminA: gender === 'male' ? 900 : 700, // mcg
    vitaminC: 90, // mg
    calcium: 1000, // mg
    iron: gender === 'male' ? 8 : 18, // mg
    potassium: 3500, // mg
    magnesium: gender === 'male' ? 400 : 310 // mg
  };
  
  res.json({
    dailyCalories: Math.round(dailyCalories),
    macros,
    micros
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});