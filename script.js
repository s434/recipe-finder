const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search');
const resultsList = document.querySelector('#results');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchRecipes();
});

async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    const selectedCuisines = getSelectedCheckboxes('cuisine-type');
    const selectedDiets = getSelectedCheckboxes('diet-label');
    const selectedHealthLabels = getSelectedCheckboxes('health-label');
    const selectedMealTypes = getSelectedCheckboxes('meal-type');
    const maxCalories = document.querySelector('#calories').value;

    let apiUrl = `https://api.edamam.com/search?q=${searchValue}&app_id=7aa516a5&app_key=dc836a223fb788b11ae390504d9e97ce&from=0&to=10`;

    selectedCuisines.forEach(cuisine => apiUrl += `&cuisineType=${cuisine}`);
    selectedDiets.forEach(diet => apiUrl += `&diet=${diet}`);
    selectedHealthLabels.forEach(health => apiUrl += `&health=${health}`);
    selectedMealTypes.forEach(meal => apiUrl += `&mealType=${meal}`);

    if (maxCalories) {
        apiUrl += `&calories=0-${maxCalories}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.status === 403) {
            displayError('Your API key does not have access to some of the selected filters.');
        } else if (data.hits) {
            displayRecipes(data.hits);
            resultsList.scrollIntoView({
                behavior: 'smooth', // Smooth scroll
                block: 'start',     // Align to the top of the results section
            });
        } else {
            alert('No recipes found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        displayError('An error occurred while fetching recipes.');
    }
}

function getSelectedCheckboxes(className) {
    const checkboxes = document.querySelectorAll(`.${className}`);
    const selectedValues = [];
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedValues.push(checkbox.value);
        }
    });
    return selectedValues;
}

function displayRecipes(recipes) {
    let html = '';
    recipes.forEach((recipe) => {
        html += `
        <div>
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        </div> 
        `;
    });
    resultsList.innerHTML = html;
}

function displayError(message) {
    resultsList.innerHTML = `<p>${message}</p>`;
}