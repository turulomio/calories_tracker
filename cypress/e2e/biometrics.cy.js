import { login_test_User } from "./commons"
describe('e2e Biometrics', () => {
  it('Biometrics', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('lateral_icon').click() //Find by id

    //Select biometrics
    cy.get('[href="/calories_tracker/biometrics/"] > .v-list-item__content > .v-list-item-title').click()

    // Move throw charts tabs
    cy.get('.v-slide-group__content > :nth-child(1) > .v-btn__content').click()
    cy.get('.v-slide-group__content > :nth-child(2) > .v-btn__content').click()
    cy.get('.v-slide-group__content > :nth-child(3) > .v-btn__content').click()

    // Open List views
    cy.get('h1 > .v-btn').click()

    // Adds firt biometrics
    cy.get('[inset=""] > :nth-child(2) > .v-list-item > .v-list-item__content > .v-list-item-title').click()

    cy.get('input[id="cmbActivities"]').click().type("{downArrow}{enter}") //Find by id
    cy.get('input[id="cmbWeightWishes"]').click().type("{downArrow}{enter}") //Find by id
    cy.get('input[id="txtHeight"]').click().clear().type("180") //Find by id
    cy.get('input[id="txtWeight"]').click().clear().type("90") //Find by id
    cy.get('button[id="cmd"]').click()

    // Update biometrics
    cy.get('.mdi-pencil').first().click()
    cy.get('button[id="cmd"]').click()

    // Delete biometrics
    cy.get('.mdi-delete').first().click()
    cy.get('button[id="cmd"]').click()
    
  })

  
})