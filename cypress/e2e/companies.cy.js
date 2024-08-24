import { login_test_User } from "./commons"
describe('e2e Companies', () => {
  it('Companies', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('lateral_icon').click() //Find by id

    //Select biometrics
    cy.get('[href="/calories_tracker/companies/"] > .v-list-item__content > .v-list-item-title').click()

    // Add first company
    cy.get('h1 > .v-btn').click()
    cy.get('.v-list > :nth-child(1) > :nth-child(2) > .v-list-item > .v-list-item__content > .v-list-item-title').click()

    cy.get('input[id="name"]').type("My first company") //Find by id
    cy.get('button[id="cmd"]').click()

    // Update company
    cy.get('.mdi-pencil').first().click()
    cy.get('input[id="name"]').clear().type("My first company updated") //Find by id
    cy.get('button[id="cmd"]').click()

    // Delete company
    cy.get('.mdi-delete').first().click()
    cy.get('button[id="cmd"]').click()
    
    // Move to  companies tab
    cy.get('#tabCompanies').click()

  })


  
})