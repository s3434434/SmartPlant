
describe('Request processed page', () => {

    var route = '/request-processed'

    it('Renders the page', () => {

        cy.visit(route)
    })
 
    it('Displays required fields', () => {

        cy.visit(route)
        cy.get('.gold.text-center').should('have.text', 'Request processed')
        cy.get('.btn').should('have.text', 'Home')

    })

    it('Redirects use to the landing page when home button clicked', () => {

        cy.get('.btn').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/landing')
    })
})