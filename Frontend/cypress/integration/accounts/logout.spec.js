describe('Logout page', () => {

    it('Renders the page', () => {

        cy.visit('http://localhost:3000/logout')
    })

    it('Displays logout message', () => {

        cy.visit('http://localhost:3000/logout')
        cy.get('section > .gold')
    })

    it('Redirects you home when Home button clicked', () => {
        cy.get('.btn').click()
        cy.url().should('be.equal', 'http://localhost:3000/landing')
    })
})