
describe('Password reset successful page', () => {

    var route = '/password-reset-successful'

    it('Renders the page', () => {

        cy.visit(route)
    })
 
    it('Displays required fields', () => {

        cy.visit(route)
        cy.get('section > .gold').should('have.text', 'Password reset successfully')
        cy.get('.btn').should('have.text', 'Login')

    })

    it('Redirects use to the login page when login button clicked', () => {

        cy.get('.btn').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/login')
    })
})