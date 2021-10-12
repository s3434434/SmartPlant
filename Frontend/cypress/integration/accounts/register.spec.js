
describe('Register page', () => {

    it('Renders the page', () => {

        cy.visit('http://localhost:3000/register')
    })

    
    it('Displays required fields', () => {

        cy.visit('http://localhost:3000/register')
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

        cy.visit('http://localhost:3000/register')
        cy.get('form').first().submit()
        cy.get('input:invalid').should('have.length', 6)

    })

})