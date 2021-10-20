
describe('Register page', () => {

    var route = '/register'

    it('Renders the page', () => {

        cy.visit(route)
    })

    it('Displays required fields', () => {

        cy.visit(route)
        cy.get('form').within(() => {
            cy.get('input[name="email"]')
            cy.get('input[name="phoneNumber"]')
            cy.get('input[name="firstName"]')
            cy.get('input[name="lastName"]')
            cy.get('input[name="password"]')
            cy.get('input[name="confirmPassword"]')
        })
    })

    it('Displays displays error message when required field not entered', () => {

        cy.visit(route)
        cy.get('form').first().submit()
        cy.get('input:invalid').should('have.length', 6)

    })
})