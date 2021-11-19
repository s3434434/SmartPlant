
describe('Landing page', () => {

    var route = ''

    it('Renders the page', () => {

        cy.visit(route)
    })

    it('Displays the title',() => {

        cy.visit(route).debug()
        cy.get('section > .gold').should('have.text', 'Demeter - The plant meter')
    })
})