// DOM Elements
const nutrientCalculatorForm = document.getElementById('nutrient-calculator');
const resultsSection = document.getElementById('results');
const caloriesResult = document.getElementById('calories-result');
const macrosResult = document.getElementById('macros-result');
const microsResult = document.getElementById('micros-result');
const foodList = document.getElementById('food-list');
const foodSearch = document.getElementById('food-search');
const macroList = document.getElementById('macro-list');
const microList = document.getElementById('micro-list');
const tabs = document.querySelectorAll('.tab');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Load nutrients data
  loadNutrients();
  
  // Load foods data
  loadFoods();
  
  // Setup tabs
  setupTabs();
});

nutrientCalculatorForm.addEventListener('submit', calculateNutrients);
foodSearch.addEventListener('input', filterFoods);

// Functions
function calculateNutrients(e) {
  e.preventDefault();
  
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const weight = document.getElementById('weight').value;
  const height = document.getElementById('height').value;
  const activityLevel = document.getElementById('activity').value;
  
  // Validate inputs
  if (!age || !gender || !weight || !height || !activityLevel) {
    alert('Please fill in all fields');
    return;
  }
  
  // Fetch calculated nutrients
  fetch(`/api/calculate/${age}/${gender}/${weight}/${height}/${activityLevel}`)
    .then(response => response.json())
    .then(data => {
      displayResults(data);
    })
    .catch(error => {
      console.error('Error calculating nutrients:', error);
      alert('Failed to calculate nutritional needs. Please try again.');
    });
}

function displayResults(data) {
  // Display calories
  caloriesResult.textContent = `${data.dailyCalories} calories`;
  
  // Display macronutrients
  macrosResult.innerHTML = '';
  for (const [macro, value] of Object.entries(data.macros)) {
    const li = document.createElement('li');
    li.textContent = `${macro.charAt(0).toUpperCase() + macro.slice(1)}: ${value} g`;
    macrosResult.appendChild(li);
  }
  
  // Display micronutrients
  microsResult.innerHTML = '';
  for (const [micro, value] of Object.entries(data.micros)) {
    const li = document.createElement('li');
    let unit = '';
    if (micro.includes('vitamin')) unit = ' mcg';
    else unit = ' mg';
    
    li.textContent = `${formatMicroName(micro)}: ${value}${unit}`;
    microsResult.appendChild(li);
  }
  
  // Show results section
  resultsSection.classList.remove('hidden');
}

function formatMicroName(name) {
  // Format names like 'vitaminA' to 'Vitamin A'
  if (name.startsWith('vitamin')) {
    return 'Vitamin ' + name.charAt(7).toUpperCase() + name.slice(8);
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function loadNutrients() {
  fetch('/api/nutrients')
    .then(response => response.json())
    .then(nutrients => {
      displayNutrients(nutrients);
    })
    .catch(error => {
      console.error('Error loading nutrients:', error);
    });
}

function displayNutrients(nutrients) {
  // Clear existing lists
  macroList.innerHTML = '';
  microList.innerHTML = '';
  
  // Filter and display nutrients
  nutrients.forEach(nutrient => {
    const listItem = document.createElement('li');
    listItem.className = 'nutrient-item';
    
    const title = document.createElement('h4');
    title.textContent = nutrient.name;
    
    const description = document.createElement('p');
    description.textContent = nutrient.description;
    
    const unit = document.createElement('small');
    unit.textContent = `Measured in: ${nutrient.unit}`;
    
    listItem.appendChild(title);
    listItem.appendChild(description);
    listItem.appendChild(unit);
    
    if (nutrient.type === 'macronutrient') {
      macroList.appendChild(listItem);
    } else {
      microList.appendChild(listItem);
    }
  });
}

function loadFoods() {
  fetch('/api/foods')
    .then(response => response.json())
    .then(foods => {
      window.allFoods = foods; // Store foods globally for filtering
      displayFoods(foods);
    })
    .catch(error => {
      console.error('Error loading foods:', error);
    });
}

function displayFoods(foods) {
  // Clear existing food list
  foodList.innerHTML = '';
  
  foods.forEach(food => {
    const foodCard = document.createElement('div');
    foodCard.className = 'food-card';
    
    const cardHeader = document.createElement('div');
    cardHeader.className = 'food-card-header';
    
    const title = document.createElement('h3');
    title.textContent = food.name;
    
    const category = document.createElement('span');
    category.textContent = food.category;
    
    cardHeader.appendChild(title);
    cardHeader.appendChild(category);
    
    const cardBody = document.createElement('div');
    cardBody.className = 'food-card-body';
    
    const calories = document.createElement('p');
    calories.textContent = `${food.calories} calories per ${food.servingSize}`;
    
    const nutrientsList = document.createElement('dl');
    nutrientsList.className = 'food-card-nutrients';
    
    // Add top 5 significant nutrients
    const significantNutrients = getSignificantNutrients(food.nutrients);
    significantNutrients.forEach(nutrient => {
      const dt = document.createElement('dt');
      dt.textContent = formatMicroName(nutrient.name);
      
      const dd = document.createElement('dd');
      dd.textContent = `${nutrient.value} ${nutrient.unit}`;
      
      nutrientsList.appendChild(dt);
      nutrientsList.appendChild(dd);
    });
    
    cardBody.appendChild(calories);
    cardBody.appendChild(nutrientsList);
    
    foodCard.appendChild(cardHeader);
    foodCard.appendChild(cardBody);
    
    foodList.appendChild(foodCard);
  });
}

function getSignificantNutrients(nutrients) {
  const nutrientUnits = {
    protein: 'g',
    carbs: 'g',
    fats: 'g',
    vitaminA: 'mcg',
    vitaminC: 'mg',
    calcium: 'mg',
    iron: 'mg',
    potassium: 'mg',
    magnesium: 'mg'
  };
  
  // Convert to array of objects
  const nutrientArray = Object.entries(nutrients).map(([name, value]) => {
    return {
      name,
      value,
      unit: nutrientUnits[name] || ''
    };
  });
  
  // Sort by value and take top 5
  return nutrientArray
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function filterFoods() {
  const searchTerm = foodSearch.value.toLowerCase();
  
  if (!window.allFoods) return;
  
  const filteredFoods = window.allFoods.filter(food => 
    food.name.toLowerCase().includes(searchTerm) || 
    food.category.toLowerCase().includes(searchTerm)
  );
  
  displayFoods(filteredFoods);
}

function setupTabs() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all tab panes
      document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });
      
      // Show selected tab pane
      const target = tab.dataset.target;
      document.getElementById(target).classList.add('active');
    });
  });
}