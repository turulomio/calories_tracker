import { login_test_User, add_product_from_products_vue } from "./commons"

describe('e2e Elaborated Products', () => {
  it('Elaborated Products', () => {    

    login_test_User(cy)
    cy.get('#lateral_icon').click()
    cy.get('#lateral_products').click()
    cy.get('#Products_tabElaboratedProducts').click()

    // Add a product to allow adding products_in
    add_product_from_products_vue("My product with formats")

    // Add first system products
    cy.get('h1 > .v-btn').click()
    cy.get('.v-list > :nth-child(2) > :nth-child(2) > .v-list-item > .v-list-item__content > .v-list-item-title').click()

    cy.get('#ElaboratedProductsCRUD_Name').type("My first elaborated product")
    cy.get('#ElaboratedProductsCRUD_FoodTypes').type("V{downArrow}{enter}")
    cy.get('#ElaboratedProductsCRUD_Amount').type("100")
    cy.get('#ElaboratedProductsCRUD_Comment').type("This is a comment")

    // First product in 
    cy.get('#ElaboratedProductsCRUD_cmdProductIn').click()
    cy.get('#ElaboratedProductsProductsInCRUD_Products').type("with formats{downArrow}{enter}")
    cy.get('#ElaboratedProductsProductsInCRUD_Amount').type("100")
    cy.get('#ElaboratedProductsProductsInCRUD_cmd').click()

    //Second product in with formats
    cy.get('#ElaboratedProductsCRUD_cmdProductIn').click()
    cy.get('#ElaboratedProductsProductsInCRUD_Products').type("with formats{downArrow}{enter}") //If product hasn't format fails
    cy.get('#ElaboratedProductsProductsInCRUD_ProductsFormats').type("un{downArrow}{enter}")
    cy.get('#ElaboratedProductsProductsInCRUD_Multiplier').type("{downArrow}{downArrow}{downArrow}{enter}")
    cy.get('#ElaboratedProductsProductsInCRUD_cmd').click()

    cy.get('#ElaboratedProductsCRUD_cmd').click()



    // Update a elaborated_product TODO
    // cy.get('ElaboratedProductsCRUD_iconEdit').first().click({force: true})
    // cy.get('ElaboratedProductsCRUD_Name').clear().type("My first elaborated product updated") //Find by id
    // cy.get('#cmd').click()


    // DELETE TODO
  })


  
})