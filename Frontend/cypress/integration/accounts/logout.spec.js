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

        cy.visit('/login')
        cy.get('.px-2 > [name="email"]').type('thombsaway@gmail.com')
        cy.get('.px-2 > [name="password"]').type('12345')
        cy.get('.px-2 > .text-center > .btn').click();

        cy.url().should('be.equal', Cypress.config("baseUrl") + '/plants')

        cy.get(':nth-child(4) > .nav-link > h5').click()

        cy.url().should('be.equal', Cypress.config("baseUrl") + route)

        cy.get('.btn').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/landing')
    })
})