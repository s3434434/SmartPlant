describe('Logout page', () => {

    var route = '/logout'

    it('Renders the page', () => {

        cy.visit(route)
    })

    it('Displays logout message', () => {

        cy.visit(route)
        cy.get('section > .gold')
    })

    it('Redirects you home when Home button clicked', () => {
        cy.get('.btn').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/landing')
    })
})