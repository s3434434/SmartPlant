describe('Login page', () => {

    var route = '/login'

    it('Renders the page', () => {

        cy.visit(route)
    })

    
    it('Displays required fields', () => {

        cy.visit(route)
        cy.get('.px-2 > [name="email"]')
        cy.get('.px-2 > [name="password"]')
    })

    it('Displays displays error message when required field not entered', () => {

        cy.visit(route)
        cy.get('.px-2 > .text-center > .btn').click()
        cy.get('input:invalid').should('have.length', 4)

    })

    it('Redirects user to the Plants page when correct credentials are entered', () => {

        cy.visit(route)
        cy.get('.px-2 > [name="email"]').type('user')
        cy.get('.px-2 > [name="password"]').type('user')
        cy.get('.px-2 > .text-center > .btn').click();

        cy.url().should('be.equal', Cypress.config("baseUrl") + '/plants')
    })
})