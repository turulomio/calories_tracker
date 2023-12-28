import { login_test_User, add_product_from_products_vue } from "./commons"
describe('e2e Products', () => {
  it('Products', () => {    

    login_test_User(cy)
    cy.get('#lateral_icon').click()
    cy.get('#lateral_companies').click()

    // Move to system companies tab
    cy.get('#tabSystemCompanies').click()

    //Buscamos
    cy.get("#filter").clear().type("Hacendado{enter}")

    // Link System Company to Company
    cy.get('.mdi-link-variant').first().click()
    cy.get('#tabCompanies').click()

    //Select menu products
    cy.get('#lateral_icon').click()
    cy.get('#lateral_products').click()


    
    // Move to system products tab
    cy.get('#Products_tabProducts').click()
    // Add first product
    add_product_from_products_vue("My first product")

    // Update product
    cy.get('.mdi-pencil').first().click()
    cy.get('input[id="name"]').clear().type("My first product updated") //Find by id
    cy.get('#cmd').click()

    // // Delete product
    // cy.get('.mdi-delete').first().click()
    // cy.get('#cmd').click()

    // Create second product
    add_product_from_products_vue("My second product")

    // Convert second to system product
    cy.get('.mdi-database-arrow-right').first().click()
    cy.get("#Products_filter").type("second{enter}")






    // // Add first system product
    // cy.get('h1 > .v-btn').click()
    // cy.get(':nth-child(2) > :nth-child(2) > .v-list-item').click()

    // cy.get('input[id="name"]').type("My first system product") //Find by id
    // cy.get('button[id="cmd"]').click()

    // //Buscamos
    // cy.get("#filter").clear().type("My first system product{enter}")

    // // Update system product
    // cy.get('.mdi-pencil').first().click()
    // cy.get('input[id="name"]').clear().type("My first system product updated") //Find by id
    // cy.get('button[id="cmd"]').click()

    // // Delete system product
    // //cy.get('.mdi-delete').first().click() //No se puede sale alert

    // // Link System Product to Product
    // cy.get('.mdi-link-variant').first().click()
    
    // // Move to  products tab
    // cy.get('#tabProducts').click()

  })


  
})

