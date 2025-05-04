const mealContainer = document.getElementById('meal-container');
const getMealButton = document.getElementById('get-meal');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const areaSelect = document.getElementById('area-select');
const ingredientInput = document.getElementById('ingredient-input');
const socialPanelContainer = document.querySelector('.social-panel-container');
const floatingBtn = document.querySelector('.floating-btn');
const closeBtn = document.querySelector('.close-btn');

getMealButton.addEventListener('click', () => {
    const randomMealUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';
    fetch(randomMealUrl)
        .then(res => res.json())
        .then(res => {
            const meal = res.meals[0];
            displayMealDetails(meal);
        });
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        const searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
        fetch(searchUrl)
            .then(res => res.json())
            .then(res => {
                const meals = res.meals;
                if (meals) {
                    displayMeals(meals);
                } else {
                    mealContainer.innerHTML = 'No meals found';
                }
            });
    }
});

categorySelect.addEventListener('change', () => {
    const category = categorySelect.value;
    const categoryUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    fetch(categoryUrl)
        .then(res => res.json())
        .then(res => {
            const meals = res.meals;
            displayMeals(meals);
        });
});

areaSelect.addEventListener('change', () => {
    const area = areaSelect.value;
    const areaUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
    fetch(areaUrl)
        .then(res => res.json())
        .then(res => {
            const meals = res.meals;
            displayMeals(meals);
        });
});

ingredientInput.addEventListener('input', () => {
    const ingredient = ingredientInput.value.trim();
    if (ingredient) {
        const ingredientUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
        fetch(ingredientUrl)
            .then(res => res.json())
            .then(res => {
                const meals = res.meals;
                if (meals) {
                    displayMeals(meals);
                } else {
                    mealContainer.innerHTML = 'No meals found';
                }
            });
    }
});

floatingBtn.addEventListener('click', () => {
    socialPanelContainer.classList.toggle('visible')
});

closeBtn.addEventListener('click', () => {
    socialPanelContainer.classList.remove('visible')
});

function displayMeals(meals) {
    const mealsHtml = meals.map(meal => {
        return `
            <div class="meal-card" onclick="displayMealDetailsById('${meal.idMeal}')">
                <img src="${meal.strMealThumb}" alt="Meal Image">
                <h2>${meal.strMeal}</h2>
            </div>
        `;
    }).join('');

    mealContainer.innerHTML = mealsHtml;
}

function displayMealDetailsById(id) {
    const mealUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(mealUrl)
        .then(res => res.json())
        .then(res => {
            const meal = res.meals[0];
            displayMealDetails(meal);
        });
}

function displayMealDetails(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        } else {
            break;
        }
    }

    const mealHtml = `
        <div class="meal-card">
            <img src="${meal.strMealThumb}" alt="Meal Image">
            <h2>${meal.strMeal}</h2>
            <p>${meal.strInstructions}</p>
            <h5>Ingredients:</h5>
            <ul>
                ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            ${meal.strYoutube ? `
            <h5>Video Recipe:</h5>
            <iframe width="420" height="315"
            src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}">
            </iframe>
            ` : ''}
        </div>
    `;

    mealContainer.innerHTML = mealHtml;
}