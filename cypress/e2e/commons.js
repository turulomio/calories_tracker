

export function login_test_User(cy){
    cy.visit('http://127.0.0.1:8012/calories_tracker/')
    cy.contains("Log in").click()
    cy.get("input").first().type("test")
    cy.get("input").last().type("test")
    cy.get('[id="btnLogIn"]').click() //Find by id
}