describe('template spec', () => {
  //   before(() => {
  //     // Perform a login request before each test
  //     cy.request({
  //       method: 'POST',
  //       url: 'http://127.0.0.1:8011/login/', // Replace with your actual login API endpoint
  //       body: {
  //         username: 'mariano', // Replace with actual username
  //         password: 'mariano12.'  // Replace with actual password
  //       }
  //     }).then((resp) => {
  //       expect(resp.status).to.eq(200); // Assert successful login
  //       window.localStorage.setItem('authToken', resp.body); // Store auth token if needed
  //       console.log(resp.body)
  //     });
  // })

  it('Login dialog', () => {    
    
  //   cy.intercept('POST', 'http://127.0.0.1:8011/login/', {
  //   statusCode: 200,
  //   body:  window.localStorage.getItem('authtoken') ,
  // }).as('apiCheck');

    cy.visit('http://127.0.0.1:8012/calories_tracker/')


    cy.contains("Log in").click()
    cy.get("input").first().type("mariano")
    cy.get("input").last().type("mariano12.")
    cy.get('[id="btnLogIn"]').click() //Find by id

    // cy.wait('@apiCheck');
  })
})