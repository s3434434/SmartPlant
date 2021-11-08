
describe('Confirm email page', () => {

    var route = '/confirm-email'

    it('Renders the page', () => {

        cy.visit(route)
    })

    it('Displays required fields', () => {

        cy.visit(route)
        cy.get('.gold.text-center').should('have.text', 'Email confirmation successful')

    })

    it('Redirects user to login page when login button is clicked', () => {

        cy.visit(route)
        cy.get('.mb-2 > a > .btn').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/login')
    })
})