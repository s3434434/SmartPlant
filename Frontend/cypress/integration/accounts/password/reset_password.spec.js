describe('Reset password page', () => {

    var route = '/reset-password'

    it('Renders the page', () => {

        cy.visit(route)
    })
 
    it('Displays required fields', () => {

        cy.visit(route)
        cy.get('.gold.text-center').should('have.text', 'Reset password')
        cy.get('form').within(() => {
            cy.get('input[name="newPassword"]')
            cy.get('input[name="confirmNewPassword"]')
            cy.get('.btn').should('have.text', 'Reset password')
        })
    })

    it('Displays displays error message when required field not entered', () => {

        cy.visit(route)
        cy.get('form').first().submit()
        cy.get('input:invalid').should('have.length', 1)

    })
})