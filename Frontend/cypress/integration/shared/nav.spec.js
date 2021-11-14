describe('Nav bar', () => {

    var route = ''

    it('Displays the nav bar with image and title',() => {

        cy.visit(route)
        cy.get('#navbar')
        cy.get('#nav-image')
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

    it('Redirects to landing page when nav.home clicked', () => {

        cy.visit(route)
        cy.contains('.nav-link > h5', 'Home').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/landing')
    })

    it('Redirects to login page when nav.login clicked', () => {

        cy.visit(route)
        cy.contains('.nav-link > h5', 'Login').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/login')
    })

    it('Redirects to register page when nav.register clicked', () => {

        cy.visit(route)
        cy.contains('.nav-link > h5', 'Register').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/register')
    })

    /*it('Redirects to support page when nav.support clicked', () => {

        cy.visit(route)
        cy.contains('.nav-link > h5', 'Support').click()
        cy.url().should('be.equal', Cypress.config("baseUrl") + '/support')
    })*/
})