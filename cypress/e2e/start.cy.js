describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://localhost:4430/calories_tracker')

    cy.contains("Log in").click()
    cy.get("input").first().type("mariano")
    cy.get("input").last().type("mariano12.")
    cy.get('[id="btnLogIn"]').click() //Find by id

    // cy.contains("Enter password").type("mariano12.")
  })
})