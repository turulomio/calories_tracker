import { login_test_User } from "./commons"
describe('e2e Products', () => {
  it('Products', () => {    

    login_test_User(cy)
    //Open lateral menu companies
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
    


    // Add first product
    cy.get('h1 > .v-btn').click()
    cy.get('.v-list > :nth-child(1) > :nth-child(2) > .v-list-item > .v-list-item__content > .v-list-item-title').click()

    cy.get('#name').type("My first product")
    cy.get('#companies').type("Hacendado{downArrow}{enter}")
    cy.get('#food_types').type("V{downArrow}{enter}")
    cy.get('#additives').type("{downArrow}{enter}{downArrow}{downArrow}{enter}{esc}")
    cy.get('#amount').type("100")
    cy.get('#calories').type("30")
    cy.get('#density').type("1")
    cy.get('#fat').type("2")
    cy.get('#saturated_fat').type("3")
    cy.get('#protein').type("4")
    cy.get('#carbohydrate').type("5")
    cy.get('#sugars').type("6")
    cy.get('#cholesterol').type("7")
    cy.get('#salt').type("8")
    cy.get('#sodium').type("9")
    cy.get('#potassium').type("10")
    cy.get('#fiber').type("11")
    cy.get('#ferrum').type("12")
    cy.get('#magnesium').type("13")
    cy.get('#phosphor').type("14")
    cy.get('#calcium').type("15")
    cy.get('#cmdFormat').click()
    cy.get('#FormatsCRUD_format').type("Un{downArrow}{enter}")
    cy.get('#FormatsCRUD_amount').type("100")
    cy.get('#FormatsCRUD_cmd').click()
    cy.get('#cmd').click()

    // Update product
    cy.get('.mdi-pencil').first().click()
    cy.get('input[id="name"]').clear().type("My first product updated") //Find by id
    cy.get('#cmd').click()

    // Delete product
    cy.get('.mdi-delete').first().click()
    cy.get('#cmd').click()

    // Create second product
    cy.get('h1 > .v-btn').click()
    cy.get('.v-list > :nth-child(1) > :nth-child(2) > .v-list-item > .v-list-item__content > .v-list-item-title').click()

    cy.get('#name').type("My second product")
    cy.get('#companies').type("Hacendado{downArrow}{enter}")
    cy.get('#food_types').type("V{downArrow}{enter}")
    cy.get('#additives').type("{downArrow}{enter}{downArrow}{downArrow}{enter}{esc}")
    cy.get('#amount').type("100")
    cy.get('#calories').type("30")
    cy.get('#density').type("1")
    cy.get('#fat').type("2")
    cy.get('#saturated_fat').type("3")
    cy.get('#protein').type("4")
    cy.get('#carbohydrate').type("5")
    cy.get('#sugars').type("6")
    cy.get('#cholesterol').type("7")
    cy.get('#salt').type("8")
    cy.get('#sodium').type("9")
    cy.get('#potassium').type("10")
    cy.get('#fiber').type("11")
    cy.get('#ferrum').type("12")
    cy.get('#magnesium').type("13")
    cy.get('#phosphor').type("14")
    cy.get('#calcium').type("15")
    cy.get('#cmdFormat').click()
    cy.get('#FormatsCRUD_format').type("Un{downArrow}{enter}")
    cy.get('#FormatsCRUD_amount').type("100")
    cy.get('#FormatsCRUD_cmd').click()
    cy.get('#cmd').click()


    // Convert second to system product
    cy.get('.mdi-database-arrow-right').first().click()
    cy.get("#Products_filter").type("second{enter}")

    
    // // Move to system products tab
    // cy.get('#tabSystemProducts').click()

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