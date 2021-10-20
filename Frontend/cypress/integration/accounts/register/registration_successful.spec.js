
describe('Registration successful page', () => {

    var route = '/registration-successful'

    it('Renders the page', () => {

        cy.visit(route)
    })

    it('Displays required fields', () => {

        cy.visit(route)
        cy.get('.gold.text-center').should('have.text', 'Registration successful')

    })

    it('Redirects user to login page when login button is clicked', () => {

        cy.visit(route)
        cy.get('.btn').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/landing')
    })
})