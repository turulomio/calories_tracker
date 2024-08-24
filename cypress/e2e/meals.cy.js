import { login_test_User, add_product_from_products_vue } from "./commons"
describe('e2e Meals', () => {
  it('Meals', () => {    

    login_test_User(cy)


    // Add needed product
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_products').click()
    add_product_from_products_vue("Product with format for meals")

    // Enter in Meals
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_meals').click()

    //Add meal
    cy.get('h1 > .v-btn').click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('MealsCRUD_Products').type("format{downArrow}{enter}")
    cy.getDataTest('MealsCRUD_Amount').type("33")
    cy.getDataTest('MealsCRUD_Button').click()



    // Delete this day meals
    cy.get('h1 > .v-btn').click()
    cy.getDataTest('MyMenuInline_Header0_Item1').click()

  })


  
})

