import { login_test_User } from "./commons"
describe('e2e Pill organizer', () => {
  it('Pill organizer', () => {    

    login_test_User(cy)


    // Add needed product
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_pill_organizer').click()

  })


  
})

