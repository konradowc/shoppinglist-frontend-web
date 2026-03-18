describe('Shared a list', () => {

    // go to (url defined in cypress config)
    beforeEach(() => {
        cy.visit('/')
    })

    it('can receive updates from others', () => {
        const whatToAdd = "Bananas"

        cy.wait(300)
        cy.get('[data-cy="singlelist-component"]').invoke('attr', 'data-cy-listid').then((listId) => {
            cy.request('PATCH', 'http://localhost:8080/list/'+listId+'/contents', { content_to_add: [ whatToAdd ] })

            // wait to get the update and display it
            cy.get('[data-cy="table-elem-'+whatToAdd+'"]').should('exist')
        })
    })
})