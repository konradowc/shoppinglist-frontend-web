describe('Item functionality', () => {

    const createExpandedItem = () => {
        const itemName = "Soup"
        // Mock backend API call
        cy.intercept('GET', 'list/*/item/*/expandable-options', {
            fixture: 'soup_expandableopts.json'
        }).as('expandableOptions')

        // create an item
        cy.get('[data-cy="input-box"]').type(itemName+"{enter}")
        cy.get('[data-cy="table-elem-'+itemName+'"]').should('exist')

        // expand it
        cy.get('[data-cy="expand-btn-'+itemName+'"]').click()

        return cy.get('[data-cy="item-table"]').find('tr').should('have.length', 12)
    }

    // go to (url defined in cypress config)
    beforeEach(() => {
        cy.visit('/')
    })

    //
    // Happy paths
    //

    it('can add an item', () => {
        cy.get('[data-cy="input-box"]').type("Apples{enter}")
        cy.get('[data-cy="table-elem-Apples"]').should('exist')
    })

    it('can remove an item', () => {
        // create an item
        cy.get('[data-cy="input-box"]').type("Apples{enter}")
        cy.get('[data-cy="table-elem-Apples"]').should('exist')

        // delete the item
        cy.get('[data-cy="del-item-btn-Apples"]').click()

        // check if it's gone
        cy.get('[data-cy="del-item-btn-Apples"]').should('not.exist')
    })

    it('can expand an item', () => {
        createExpandedItem()
    })

    it('can remove sub-items', () => {
        createExpandedItem()

        // delete a sub-item
        cy.get('[data-cy="del-item-btn-carrots"]').click()

        // make sure it's gone
        cy.get('[data-cy="table-elem-carrots"]').should('not.exist')
    })

    it('can remove top-level item, to remove it and all sub-items', () => {
        createExpandedItem()

        // delete the top-level item
        cy.get('[data-cy="del-item-btn-Soup"]').click()

        // make sure all items are gone
        cy.get('[data-cy="item-table"]').find('tr').should('have.length', 0)
    })

    //
    // Edge cases
    //

    it('can handle strange characters', () => {
        // create an item
        cy.get('[data-cy="input-box"]').type("😊{enter}")
        cy.get('[data-cy="table-elem-😊"]').should('exist')
    })

    it('can handle input overflow', () => {
        const reallyLongString = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

        // create interceptor to wait until backend responds
        cy.intercept('PATCH', 'list/*/contents').as('contentUpload')

        // create an item
        cy.get('[data-cy="input-box"]').type(reallyLongString+"{enter}")

        // wait for backend to respond, and then a little longer to make sure UI changes occur
        cy.wait('@contentUpload')
        cy.wait(300)

        // for now, just won't exist - TO-DO: handle error msg
        cy.get('[data-cy="table-elem-'+reallyLongString+'"]').should('not.exist')
    })
})