import { test, expect } from './fixtures.js';
import {
    recipes_add_from_Recipes,
    elaborations_add_from_RecipesView,
    elaborations_experiences_add_from_ElaborationView,
} from './commons.js';

test('Elaboration experience insertion', async ({ page }) => {
    // Navigate to Recipes
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralRecipes').click();

    // Create Recipe
    const recipe = await recipes_add_from_Recipes(page, "Recipe for Experience Test");

    // View Recipe
    await page.getByTestId(`Recipes_Table_Row${recipe.id}`).click();

    // Add Elaboration
    const elaboration = await elaborations_add_from_RecipesView(page, "4");

    // Open Elaboration View
    await page.getByTestId(`TableElaborations_Row${elaboration.id}`).click();

    // Add Elaboration Experience
    const experience = await elaborations_experiences_add_from_ElaborationView(page);

    // Verify dialog closes and row is visible
    await expect(page.getByTestId('ElaborationsExperiencesCRUD_Button')).toBeHidden();
    await expect(page.getByTestId(`TableElaborationsExperiences_Row${experience.id}`)).toBeVisible();
});
