import { login_test_User, add_product_from_products_vue } from "./commons"
describe('e2e Products Off', () => {
  it('Products Off', () => {    

    login_test_User(cy)

    //Select menu products
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_products').click()


    cy.get('h1 > .v-btn').last().click()
    cy.getDataTest('MyMenuInline_Header2_Item0').click()
    cy.getDataTest("OpenFoodFactsSearch_Search").type("Comino molido carrefour{enter}", {timeout:30000})
    cy.getDataTest('OpenFoodFactsSearch_Table_ButtonAddProduct8431876265828').click()
    cy.getDataTest('ProductsCRUD_FoodTypes').type("Spices{downArrow}{enter}")
    cy.getDataTest('ProductsCRUD_ButtonAdd').click()
    
  })


  
})

