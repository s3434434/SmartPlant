describe('Reset password page', () => {

    var route = '/reset-password'

    it('Renders the page', () => {

        cy.visit(route)
    })
 
    it('Displays required fields', () => {

        cy.visit(route)
        cy.get('form').within(() => {
            cy.get('input[name="newPassword"]')
            cy.get('input[name="confirmNewPassword"]')
        })
    })

    it('Displays displays error message when required field not entered', () => {

        cy.visit(route)
        cy.get('form').first().submit()
        cy.get('input:invalid').should('have.length', 2)

    })
})