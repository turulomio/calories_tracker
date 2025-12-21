import { test, expect } from './fixtures.js';
import {v_text_input_settext, expect_native_confirm_and_accept_it} from './reusing/playwright_vuetify.js';
import {
    products_add_from_Products,
    meals_add_from_Meals,
} from './commons.js';



test('Meals', async ({ page }) => {

    //Add Product
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralProducts').click();
    await products_add_from_Products(page, "Product for Meals")

    //Add meal
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralMeals').click();
    var meals_id=await meals_add_from_Meals(page)

    // Update Meals
    await page.getByTestId(`Meals_Table_IconEdit${meals_id}`).click()
    await v_text_input_settext(page,"MealsCRUD_Amount", "333")
    await page.getByTestId('MealsCRUD_Button').click()
    await expect(page.getByTestId('MealsCRUD_Button')).toBeHidden()

    // Delete Meals
    await page.getByTestId(`Meals_Table_IconDelete${meals_id}`).click()
    await expect_native_confirm_and_accept_it(page)
    await page.getByTestId('MealsCRUD_Button').click()
    await expect(page.getByTestId('MealsCRUD_Button')).toBeHidden()

});
