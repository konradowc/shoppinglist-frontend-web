describe('List Navigation', () => {

    // go to (url defined in cypress config)
    beforeEach(() => {
        cy.visit('/')
    })

    const getListId = () => {
        return cy.get('[data-cy="singlelist-component"]').invoke('attr', 'data-cy-listid')
    }

    it('can make a list', () => {
        getListId().then((firstListId) => {
             cy.get('[data-cy="new-list-btn"]').click()
             
            // not using getListId, using 'should not.have.attr' so React can catch up
            cy.get('[data-cy="singlelist-component"]').should('not.have.attr', 'data-cy-listid', firstListId)
        })
    })

    it('can delete a list', () => {
        getListId().then((firstListId) => {
            cy.get('[data-cy="del-list-btn"]').click()

            // not using getListId, using 'should not.have.attr' so React can catch up
            cy.get('[data-cy="singlelist-component"]').should('not.have.attr', 'data-cy-listid', firstListId)
        })
    })

    it('can rename a list', () => {
        cy.get('[data-cy="name-box"]').type("{selectall}{backspace}My new name{enter}")
        cy.reload()
        cy.get('[data-cy="name-box"]').should('have.value', "My new name")
    })
});