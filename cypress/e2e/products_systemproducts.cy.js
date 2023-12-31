import { login_test_User } from "./commons"
describe('e2e System products', () => {
  it('System Products', () => {    

    login_test_User(cy)
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_products').click()


    // SYSTEM PRODUCTS

    cy.get("#Products_filter").type("{enter}")

    
    // // Move to system products tab
    cy.get('#Products_tabSystemProducts').click()

    // Add first system products
    cy.get('h1 > .v-btn').click()
    cy.get('.v-list > :nth-child(3) > :nth-child(2) > .v-list-item > .v-list-item__content > .v-list-item-title').click()

    cy.get('#SystemProductsCRUD_Name').type("My first system product")
    cy.get('#SystemProductsCRUD_SystemCompanies').type("Hacendado{downArrow}{enter}")
    cy.get('#SystemProductsCRUD_FoodTypes').type("V{downArrow}{enter}")
    cy.get('#SystemProductsCRUD_Additives').type("{downArrow}{enter}{downArrow}{downArrow}{enter}{esc}")
    cy.get('#SystemProductsCRUD_Amount').type("100")
    cy.get('#SystemProductsCRUD_Density').type("1")
    cy.get('#SystemProductsCRUD_Calories').type("30")
    cy.get('#SystemProductsCRUD_Fat').type("2")
    cy.get('#SystemProductsCRUD_SaturatedFat').type("3")
    cy.get('#SystemProductsCRUD_Protein').type("4")
    cy.get('#SystemProductsCRUD_Carbohydrate').type("5")
    cy.get('#SystemProductsCRUD_Sugars').type("6")
    cy.get('#SystemProductsCRUD_Salt').type("8")
    cy.get('#SystemProductsCRUD_Sodium').type("9")
    cy.get('#SystemProductsCRUD_Cholesterol').type("7")
    cy.get('#SystemProductsCRUD_Potassium').type("10")
    cy.get('#SystemProductsCRUD_Fiber').type("11")
    cy.get('#SystemProductsCRUD_Ferrum').type("12")
    cy.get('#SystemProductsCRUD_Magnesium').type("13")
    cy.get('#SystemProductsCRUD_Phosphor').type("14")
    cy.get('#SystemProductsCRUD_Calcium').type("15")
    cy.get('#SystemProductsCRUD_cmdFormat').click()
    cy.get('#FormatsCRUD_format').type("Un{downArrow}{enter}")
    cy.get('#FormatsCRUD_amount').type("100")
    cy.get('#FormatsCRUD_cmd').click()
    cy.get('#SystemProductsCRUD_cmd').click()




    // // Update system product NO ME SALIO
    // cy.get(':nth-child(2) > [style="width: 7%;"] > #Products_SystemProductsMdiPencil').click()
    // cy.get('#SystemProductsCRUD_Name').clear().type("My first system product updated") //Find by id
    // cy.get('#SystemProductsCRUD_cmd').click()

    // // Delete system product
    // cy.get('.mdi-delete').first().click()
    // cy.get('#SystemProductsCRUD_cmd').click()



  })


  
})

