import { login_test_User } from "./commons"
describe('e2e Pill organizer', () => {
  it('Pill organizer', () => {    
    login_test_User(cy)
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_pill_organizer').click()

    // Add each day
    cy.get('h1 > .v-btn').click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()

  })


  
})

