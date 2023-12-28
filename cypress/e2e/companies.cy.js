import { login_test_User } from "./commons"
describe('e2e Companies', () => {
  it('Companies', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.get('[id="lateral_icon"]').click() //Find by id

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

    // Move to system companies tab
    cy.get('#tabSystemCompanies').click()

    // Add first system company
    cy.get('h1 > .v-btn').click()
    cy.get(':nth-child(2) > :nth-child(2) > .v-list-item').click()

    cy.get('input[id="name"]').type("My first system company") //Find by id
    cy.get('button[id="cmd"]').click()

    //Buscamos
    cy.get("#filter").clear().type("My first system company{enter}")

    // Update system company
    cy.get('.mdi-pencil').first().click()
    cy.get('input[id="name"]').clear().type("My first system company updated") //Find by id
    cy.get('button[id="cmd"]').click()

    // Delete system company
    //cy.get('.mdi-delete').first().click() //No se puede sale alert

    // Link System Company to Company
    cy.get('.mdi-link-variant').first().click()
    
    // Move to  companies tab
    cy.get('#tabCompanies').click()

  })


  
})