import { test, expect } from './fixtures.js';
import {v_text_input_settext, expect_native_confirm_and_accept_it} from './reusing/playwright_vuetify.js';
import {
    elaboratedproducts_add_from_Products,
    products_add_from_Products
} from './commons.js';



test('Elaborated product', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralProducts').click();
    
    // Create product
    var products_id=await products_add_from_Products(page)

    // Move to elaborated product
    await page.getByTestId('Products_TabElaboratedProducts').click()
    var elaboratedproducts_id=await elaboratedproducts_add_from_Products(page)



    // // Update Products
    // await page.getByTestId(`Products_Table_IconEdit${products_id}`).click()
    // await v_text_input_settext(page,"ProductsCRUD_Name", "My product updated")
    // await page.getByTestId('ProductsCRUD_ButtonAdd').click()
    // await expect(page.getByTestId('ProductsCRUD_ButtonAdd')).toBeHidden()

    // // Delete Products
    // await page.getByTestId(`Products_Table_IconDelete${products_id}`).click()
    // await expect_native_confirm_and_accept_it(page)
    // await page.getByTestId('ProductsCRUD_ButtonAdd').click()
    // await expect(page.getByTestId('ProductsCRUD_ButtonAdd')).toBeHidden()

});

//     // First product in 
//     cy.get('#ElaboratedProductsCRUD_cmdProductIn').click()
//     cy.get('#ElaboratedProductsProductsInCRUD_Products').type("with formats{downArrow}{enter}")
//     cy.get('#ElaboratedProductsProductsInCRUD_Amount').type("100")
//     cy.get('#ElaboratedProductsProductsInCRUD_cmd').click()

//     //Second product in with formats
//     cy.get('#ElaboratedProductsCRUD_cmdProductIn').click()
//     cy.get('#ElaboratedProductsProductsInCRUD_Products').type("with formats{downArrow}{enter}") //If product hasn't format fails
//     cy.get('#ElaboratedProductsProductsInCRUD_ProductsFormats').type("un{downArrow}{enter}")
//     cy.get('#ElaboratedProductsProductsInCRUD_Multiplier').type("{downArrow}{downArrow}{downArrow}{enter}")
//     cy.get('#ElaboratedProductsProductsInCRUD_cmd').click()

//     cy.get('#ElaboratedProductsCRUD_cmd').click()



//     // Update a elaborated_product TODO
//     // cy.get('ElaboratedProductsCRUD_iconEdit').first().click({force: true})
//     // cy.get('ElaboratedProductsCRUD_Name').clear().type("My first elaborated product updated") //Find by id
//     // cy.get('#cmd').click()


//     // DELETE TODO
//   })


  
// })