const mealContainer = document.getElementById("meals")
const favContainer = document.querySelector(".fav-meals")


getRandomMeal()
fetchFavMeals()
async function getRandomMeal(){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    console.log(randomMeal)
    displayRandomMeal(randomMeal,true);
}
async function getMealById(id){
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const respData = await resp.json(); 
    const meal = respData.meals[0];

    return meal;

}
async function getMealsBySearch(term){
    const meals = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
}

function displayRandomMeal(mealData,random = false){
    const meal = document.createElement("div");
    meal.className="meal";
    meal.innerHTML = `
        <div class="meal-header">
            ${random ?` 
            <span class="random">Random Recipe</span>`
            : ""}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn"><i class="fas fa-heart"></i></button>
        </div>
 `;
   const likebtn = meal.querySelector(".meal-body .fav-btn");
   likebtn.addEventListener("click",()=>{
       if(likebtn.classList.contains("active")){
           removeMealLocalStorage(mealData.idMeal)
            likebtn.classList.remove("active");
       }else{
           addMeaLLocalStorage(mealData.idMeal)
           likebtn.classList.add("active");
       }
       fetchFavMeals();
   });
   
    mealContainer.appendChild(meal);

};
function addMeaLLocalStorage(mealId){
    const mealIds = getMealLocalStorage();
    localStorage.setItem("mealIds",JSON.stringify([...mealIds,mealId]));

}
 function removeMealLocalStorage(mealId){
    const mealIds = getMealLocalStorage();
    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter(id =>id !== mealId)));
 }
function getMealLocalStorage(){
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? []: mealIds; 

}
async function fetchFavMeals(){
  // clean the container
  favContainer.innerHTML = "";

  const mealIds = getMealLocalStorage();

  const meals = [];

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);
    addMealToFav(meal);
  }
}
function addMealToFav(mealData){
    const favMeal = document.createElement("li");
   
    favMeal.innerHTML = `
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <span>${mealData.strMeal}</span>  
        <button class="clear"><i class="fas fa-window-close"></i></button> 
 `;
 const btn = favMeal.querySelector(".clear")
 btn.addEventListener("click",()=>{
     removeMealLocalStorage(mealData.idMeal);

     fetchFavMeals()
 })
 favContainer.appendChild(favMeal)

};


// location.reload()

