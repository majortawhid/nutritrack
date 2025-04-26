import { useState, useEffect } from 'react';

export default function FoodModal({ food, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    servingSize: '',
    calories: 0,
    nutrients: {
      protein: 0,
      carbs: 0,
      fats: 0,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 0,
      iron: 0,
      potassium: 0,
      magnesium: 0
    }
  });

  useEffect(() => {
    if (food) {
      setFormData(food);
    }
  }, [food]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.nutrients) {
      setFormData({
        ...formData,
        nutrients: {
          ...formData.nutrients,
          [name]: parseFloat(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'calories' ? parseFloat(value) || 0 : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{food ? 'Edit Food' : 'Add New Food'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields for food properties */}
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Other fields... */}
          
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}