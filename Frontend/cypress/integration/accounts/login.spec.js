describe('Login page', () => {

    it('Renders the page', () => {

        cy.visit('http://localhost:3000/login')
    })

    
    it('Displays required fields', () => {

        cy.visit('http://localhost:3000/login')
        cy.get('form').within(() => {
            cy.get('input[name="email"]')
            cy.get('input[name="password"]')
        })
    })

    it('Displays displays error message when required field not entered', () => {

        cy.visit('http://localhost:3000/login')
        cy.get('form').first().submit()
        cy.get('input:invalid').should('have.length', 4)

    })
})