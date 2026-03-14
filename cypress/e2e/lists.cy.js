describe('List Navigation', () => {

    // go to (url defined in cypress config)
    beforeEach(() => {
        cy.visit('/')
    })

    const getListId = () => {
        return cy.get('[data-cy="singlelist-component"]').invoke('attr', 'data-cy-listid')
    }

    //
    // Happy Paths 
    //

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

    it('can share a list', () => {
        cy.log("TO-DO after changing sharing behavior")
    })

    it('can navigate between lists', () => {
        // make a list
        getListId().then((firstListId) => {
            cy.get('[data-cy="new-list-btn"]').click()
            cy.get('[data-cy="singlelist-component"]').should('not.have.attr', 'data-cy-listid', firstListId).invoke('attr', 'data-cy-listid').then((secondListId) => {

                // navigate back
                cy.get('[data-cy="left-btn"]').click()
                cy.get('[data-cy="singlelist-component"]').should('not.have.attr', 'data-cy-listid', secondListId)

                // navigate forward
                cy.get('[data-cy="right-btn"]').click()
                cy.get('[data-cy="singlelist-component"]').should('not.have.attr', 'data-cy-listid', firstListId)
            })
        })
    })

    //
    // Edge cases
    //

    it('remains in-bounds during navigation', () => {
        getListId().then((listId) => {
            // navigate back
            cy.get('[data-cy="left-btn"]').click()
            cy.wait(300) // can be flaky - TO-DO: a spy?
            cy.get('[data-cy="singlelist-component"]').should('have.attr', 'data-cy-listid', listId)

            // navigate forward
            cy.get('[data-cy="right-btn"]').click()
            cy.wait(300) // can be flaky - TO-DO: a spy?
            cy.get('[data-cy="singlelist-component"]').should('have.attr', 'data-cy-listid', listId)
        })
    })
});