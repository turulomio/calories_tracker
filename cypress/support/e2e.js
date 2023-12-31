
import '@cypress/code-coverage/support';

Cypress.Commands.add('getDataTest', (selector, ...args) =>{
    return cy.get(`[data-test=${selector}]`, ...args)

})