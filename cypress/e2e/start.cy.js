describe('template spec', () => {
  it('Biometrics', () => {    
    cy.visit('http://127.0.0.1:8012/calories_tracker/')
    cy.contains("Log in").click()
    cy.get("input").first().type(Cypress.env("username"))
    cy.get("input").last().type(Cypress.env("password"))
    cy.get('[id="btnLogIn"]').click() //Find by id

    //Open lateral menu
    cy.get('[id="lateral_icon"]').click() //Find by id

    //Select biometrics
    cy.get('[href="/calories_tracker/biometrics/"] > .v-list-item__content > .v-list-item-title').click()

    // Move throw charts tabs
    cy.get('.v-slide-group__content > :nth-child(1) > .v-btn__content').click()
    cy.get('.v-slide-group__content > :nth-child(2) > .v-btn__content').click()
    cy.get('.v-slide-group__content > :nth-child(3) > .v-btn__content').click()

    // Open List views
    cy.get('h1 > .v-btn').click()

    // Adds a new biometrics
    cy.get('[inset=""] > :nth-child(2) > .v-list-item > .v-list-item__content > .v-list-item-title').click()
  })
})