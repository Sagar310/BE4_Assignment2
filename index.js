const express = require("express")
require("dotenv").config();

const app = express();
const { initializeDatabase } = require("./db/db.connect")
const Recipe = require("./models/recipe.models")

app.use(express.json());

initializeDatabase();

async function createRecipe(newRecipe) {
    try{
        const recipe = new Recipe(newRecipe);
        const savedRecipe = await recipe.save();
        return savedRecipe;
    }
    catch(error){
        console.log(error);
    }
}

app.post("/recipes", async (req, res) => {
    try{
        const savedRecipe = await createRecipe(req.body)
        res.status(201).json({message: "Recipe added successfully.", recipe: savedRecipe})
    }
    catch(error){
        res.status(500).json({error: "Failed to add the recipe."})
    }
})

async function readAllRecipes() {
    try{
        const recipes = await Recipe.find()
        return recipes;
    }
    catch(error){
        throw error;
    }
}

app.get("/recipes", async (req, res) => {
    try {
        const recipes = await readAllRecipes();
        if(recipes.length > 0)
        {
            res.json(recipes);
        }
        else{
            res.status(404).json({error: "No recipes found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch recipes."});
    }
})

async function readRecipeByTitle(recipeTitle){
    try{
        const recipe = await Recipe.findOne({title: recipeTitle});
        return recipe;
    }
    catch(error){
        throw error
    }
}

app.get("/recipes/:title", async (req, res) => {
    try{
        const recipe = await readRecipeByTitle(req.params.title);
        if(recipe){
            res.json(recipe);
        }
        else{
            res.status(404).json({error: "Recipe not found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch recipe."});
    }
})

async function readRecipesByAuthor(authorName){
    try{
        const recipes = await Recipe.find({author: authorName});
        return recipes;
    }
    catch(error){
        throw error
    }
}

app.get("/recipes/author/:authorName", async (req, res) => {
    try{
        const recipes = await readRecipesByAuthor(req.params.authorName);
        if(recipes.length > 0){
            res.json(recipes);
        }
        else{
            res.status(404).json({error: "No recipes found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch recipes."});
    }
})

async function readEasyDifficultyRecipes(){
    try{        
        const recipes = await Recipe.find({difficulty: "Easy"});        
        return recipes;
    }
    catch(error){        
        throw error;
    }
}

app.get("/recipes/difficulty/easy", async (req, res) => {
    try{        
        const recipes = await readEasyDifficultyRecipes();        
        if(recipes.length > 0){
            res.json(recipes);
        }
        else{
            res.status(404).json({error: "No recipes found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch recipes."});
    }
})

async function updateRecipe(recipeId, dataToUpdate) {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {
            new: true
        });
        return updatedRecipe;
    } catch (error) {
        throw error;
    }
}

app.post("/recipes/:recipeId", async (req, res) => {
    try {
        const updatedRecipe = await updateRecipe(req.params.recipeId, req.body);
        if(updatedRecipe){            
            res.status(200).json({message: "Recipe updated successfully.", updatedRecipe: updatedRecipe});
        }
        else{
            res.status(404).json({message: "Recipe does not exist."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update the recipe."});
    }
})

async function updateRecipeByTitle(recipeTitle, dataToUpdate) {
    try {
        const updatedRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {
            new: true
        });
        return updatedRecipe;
    } catch (error) {
        throw error;
    }
}

app.post("/recipes/title/:recipeTitle", async (req, res) => {
    try {
        const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle, req.body);
        if(updatedRecipe){            
            res.status(200).json({message: "Recipe updated successfully.", updatedRecipe: updatedRecipe});
        }
        else{
            res.status(404).json({message: "Recipe does not exist."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update the recipe."});
    }
})

async function deleteRecipeById(recipeId) {
    try {
        const deletedRecipe = Recipe.findByIdAndDelete(recipeId);
        return deletedRecipe;
    } catch (error) {
        throw error;
    }
}

app.delete("/recipes/:recipeId", async (req, res) => {
    try {
        const deletedRecipe = await deleteRecipeById(req.params.recipeId);
        if(deletedRecipe){
            res.status(200).json({message: "Recipe deleted successfully.", deletedRecipe: deletedRecipe});
        }
        else{
            res.status(404).json({error: "Recipe does not exist."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to delete the recipe."});
    }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});