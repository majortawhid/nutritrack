import { useState, useEffect, useContext } from 'react';
import { getFoods, deleteFood } from '../../services/api';
import FoodModal from './FoodModal';
import { AuthContext } from '../../context/AuthContext';

export default function FoodDatabase() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getFoods();
        setFoods(data);
      } catch (error) {
        console.error('Failed to fetch foods', error);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteFood(id);
        setFoods(foods.filter(food => food._id !== id));
      } catch (error) {
        console.error('Failed to delete food', error);
      }
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>Food Database</h2>
        {user && (
          <button onClick={() => setShowModal(true)} className="btn">
            Add Food
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Search foods..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="food-grid">
        {filteredFoods.map(food => (
          <div key={food._id} className="food-card">
            <div className="food-card-header">
              <h3>{food.name}</h3>
              <span>{food.category}</span>
            </div>
            <div className="food-card-body">
              <p>{food.calories} calories per {food.servingSize}</p>
              <div className="nutrient-list">
                <p>Protein: {food.nutrients.protein}g</p>
                <p>Carbs: {food.nutrients.carbs}g</p>
                <p>Fats: {food.nutrients.fats}g</p>
              </div>
              {user && (
                <div className="food-actions">
                  <button 
                    onClick={() => {
                      setEditingFood(food);
                      setShowModal(true);
                    }}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(food._id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <FoodModal 
          food={editingFood}
          onClose={() => {
            setShowModal(false);
            setEditingFood(null);
          }}
          onSave={(updatedFood) => {
            if (editingFood) {
              setFoods(foods.map(f => f._id === updatedFood._id ? updatedFood : f));
            } else {
              setFoods([...foods, updatedFood]);
            }
          }}
        />
      )}
    </section>
  );
}