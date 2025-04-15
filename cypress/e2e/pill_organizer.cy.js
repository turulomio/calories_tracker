import { login_test_User } from "./commons"
describe('e2e Pill organizer', () => {
  it('Pill organizer', () => {    
    login_test_User(cy)
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_pill_organizer').click()

    // Add a simple pill event
    cy.get('h1 > .v-btn').click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('PillEventsCRUD_Name').type("Aspirine Simple")
    cy.getDataTest('PillEventsCRUD_Button').click()

    // Add each day
    cy.get('h1 > .v-btn').click()
    cy.getDataTest('MyMenuInline_Header0_Item1').click()
    cy.getDataTest('PillEventsCRUD_Name').type("Aspirine")
    cy.getDataTest('PillEventsCRUD_Days').type("3")
    cy.getDataTest('PillEventsCRUD_Button').click()

    // Add each n hours
    cy.get('h1 > .v-btn').click()
    cy.getDataTest('MyMenuInline_Header0_Item2').click()
    cy.getDataTest('PillEventsCRUD_Name').type("Big Aspirine")
    cy.getDataTest('PillEventsCRUD_Button').click()

  })


  
})

