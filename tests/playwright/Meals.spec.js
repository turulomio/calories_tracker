import { test, expect } from './fixtures.js';
import {v_text_input_settext, expect_native_confirm_and_accept_it} from './reusing/playwright_vuetify.js';
import {meals_add_from_Meals} from './commons.js';



test('Meals', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralMeals').click();

    var companies_id=await meals_add_from_Meals(page)

    // Update Companies
    await page.getByTestId(`Companies_Table_IconEdit${companies_id}`).click()
    await v_text_input_settext(page,"CompaniesCRUD_Name", "My Linux company updated")
    await page.getByTestId('CompaniesCRUD_Button').click()
    await expect(page.getByTestId('CompaniesCRUD_Button')).toBeHidden()

    // Delete Companies
    await page.getByTestId(`Companies_Table_IconDelete${companies_id}`).click()
    await expect_native_confirm_and_accept_it(page)
    await page.getByTestId('CompaniesCRUD_Button').click()
    await expect(page.getByTestId('CompaniesCRUD_Button')).toBeHidden()

});

    // cy.getDataTest('lateral_icon').click()
    // cy.getDataTest('lateral_products').click()
    // add_product_from_products_vue("Product with format for meals")

    // // Enter in Meals
    // cy.getDataTest('lateral_icon').click()
    // cy.getDataTest('lateral_meals').click()

    // //Add meal
    // cy.get('h1 > .v-btn').click()
    // cy.getDataTest('MyMenuInline_Header0_Item0').click()
    // cy.getDataTest('MealsCRUD_Products').type("format{downArrow}{enter}")
    // cy.getDataTest('MealsCRUD_Amount').type("33")
    // cy.getDataTest('MealsCRUD_Button').click()



    // // Delete this day meals
    // cy.get('h1 > .v-btn').click()
    // cy.getDataTest('MyMenuInline_Header0_Item1').click()


    // //Add meal
    // cy.get('h1 > .v-btn').click()
    // cy.getDataTest('MyMenuInline_Header0_Item0').click()
    // cy.getDataTest('MealsCRUD_Products').type("format{downArrow}{enter}")
    // cy.getDataTest('MealsCRUD_Amount').type("33")
    // cy.getDataTest('MealsCRUD_Button').click()
    // //Add meal
    // cy.get('h1 > .v-btn').click()
    // cy.getDataTest('MyMenuInline_Header0_Item0').click()
    // cy.getDataTest('MealsCRUD_Products').type("format{downArrow}{enter}")
    // cy.getDataTest('MealsCRUD_Amount').type("33")
    // cy.getDataTest('MealsCRUD_Button').click()

    // // Shows mails ranking report
    // cy.getDataTest('lateral_icon').click()
    // cy.getDataTest('lateral_reports').click()
    // cy.getDataTest('lateral_meals_ranking').click()