import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { calculateNutrition } from '../../services/api';
import { Bar, Pie } from 'react-chartjs-2';

export default function NutritionCalculator() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    age: user?.profile?.age || '',
    gender: user?.profile?.gender || '',
    weight: user?.profile?.weight || '',
    height: user?.profile?.height || '',
    activityLevel: user?.profile?.activityLevel || ''
  });
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await calculateNutrition(formData);
      setResults(data);
    } catch (error) {
      alert('Calculation failed');
    }
  };

  const macroData = results ? {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [{
      data: [results.macros.protein, results.macros.carbs, results.macros.fats],
      backgroundColor: ['#4CAF50', '#FF9800', '#2196F3']
    }]
  } : null;

  const microData = results ? {
    labels: Object.keys(results.micros).map(key => 
      key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    ),
    datasets: [{
      label: 'Daily Requirement',
      data: Object.values(results.micros),
      backgroundColor: '#4CAF50'
    }]
  } : null;

  return (
    <section className="section">
      <h2>Nutrition Calculator</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields same as Vue version */}
        <button type="submit" className="btn">Calculate</button>
      </form>

      {results && (
        <div className="results-container">
          <h3>Your Daily Requirements</h3>
          <div className="result-item">
            <h4>Daily Calories</h4>
            <p>{results.dailyCalories} calories</p>
          </div>
          
          <div className="chart-container">
            <h4>Macronutrients</h4>
            <Pie data={macroData} />
          </div>
          
          <div className="chart-container">
            <h4>Micronutrients</h4>
            <Bar data={microData} />
          </div>
        </div>
      )}
    </section>
  );
}