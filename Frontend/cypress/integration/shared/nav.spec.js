describe('Nav bar', () => {

    var route = ''

    it('Displays the nav bar with image and title',() => {

        cy.visit(route)
        cy.get('#navbar')
        cy.get('.img-fluid')
        cy.get('.navbar-title > h1.gold')
        cy.get('h4.gold')
    })

    it('Displays the nav bar with correct number of page options',() => {

        cy.visit(route)
        cy.get('#navbar')
        cy.get('#nav-options')
        cy.get('#nav-options').find('li').should('have.length', 4)
    })

    it('Displays the nav bar with correct heading options',() => {

        cy.visit(route)
        cy.get('#navbar').contains('Demeter')
        cy.get('#navbar').contains('The Plant Meter')
        cy.get('#nav-options').contains('Home')
        cy.get('#nav-options').contains('Login')
        cy.get('#nav-options').contains('Register')
        cy.get('#nav-options').contains('Support')
    })
})