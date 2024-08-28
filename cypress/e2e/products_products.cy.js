import { login_test_User, add_product_from_products_vue } from "./commons"
describe('e2e Products', () => {
  it('Products', () => {    
    login_test_User(cy)
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_products').click()


    
    // Move to system products tab
    cy.get('#Products_tabProducts').click()
    // Add first product
    add_product_from_products_vue("My first product")

    // // Update product
    // cy.get('.mdi-pencil').first().click()
    // cy.get('input[id="name"]').clear().type("My first product updated") //Find by id
    // cy.get('#cmd').click()

    // // Delete product
    // cy.get('.mdi-delete').first().click()
    // cy.get('#cmd').click()

  })


  
})

