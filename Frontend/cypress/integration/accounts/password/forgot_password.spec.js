
describe('Forgot password page', () => {

    var route = '/forgot-password'

    it('Renders the page', () => {

        cy.visit(route)
    })
 
    it('Displays required fields', () => {

        cy.visit(route)
        cy.get('.gold.text-center').should('have.text', 'Forgot password')
        
        cy.get('form').first().within(() => {
            cy.get('input[name="email"]')
            cy.get('.btn').should('have.text', 'Reset password')
        })
    })

    it('Displays displays error message when required field not entered', () => {

        cy.visit(route)
        cy.get('.btn').click()
        cy.get('input:invalid').should('have.length', 1)
    })

    it('Redirects use to the request processed page when reset password button clicked', () => {

        cy.visit(route)
        cy.get('.px-2 > .form-control').type('test@email.com')
        cy.get('.px-2 > .text-center > .btn').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/request-processed')
    })
})