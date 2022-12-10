Cypress.Cookies.defaults({
  preserve: 'shoppingList',
})

describe('login', () => {

  it('should start at login page ', () => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    });
    cy.visit('http://localhost:4200')
    cy.url().should('includes', 'login')
  })

  it('propely filled form should be valid', () => {
    cy.get('.login-btn').should('be.disabled')

    cy.get('input[formcontrolname="username"]').type("testuseraccount")
    cy.get('input[formcontrolname="password"]').type("password")
  })

  it('after click should redirect to /user-lists', () => {
    cy.get('.login-btn').click()
    cy.url().should('includes', 'user-lists')
    cy.getCookie('shoppingList').should('exist')
  })

  it('should save cookie', () => {
    cy.getCookie('shoppingList').should('exist')
  })
})



describe('User lists managing', () => {
  it('should cookie be saved', () => {
    cy.pause()
    cy.getCookie('shoppingList').should('exist')
  })

  it("add new list 1", () => {
    cy.get('.add_button').should('be.disabled')
    cy.get('input[formcontrolname="name"]').type("test list name 1")
    cy.get('.add_button').should('be.disabled')
    cy.get('input[formcontrolname="date"]').type("2022-08-15")
    cy.get('.add_button').should('not.be.disabled')
    cy.get('.add_button').click()
    cy.contains('test list name 1').should('exist')
  })

  it("add new list 2", () => {
    cy.get('.add_button').should('be.disabled')
    cy.get('input[formcontrolname="name"]').type("test list name 2")
    cy.get('.add_button').should('be.disabled')
    cy.get('input[formcontrolname="date"]').type("2022-09-18")
    cy.get('.add_button').should('not.be.disabled')
    cy.get('.add_button').click()
    cy.contains('test list name 2').should('exist')
  })

  it("add new list 3", () => {
    cy.get('.add_button').should('be.disabled')
    cy.get('input[formcontrolname="name"]').type("test list name 3")
    cy.get('.add_button').should('be.disabled')
    cy.get('input[formcontrolname="date"]').type("2023-01-18")
    cy.get('.add_button').should('not.be.disabled')
    cy.get('.add_button').click()
    cy.contains('test list name 3').should('exist')
  })

  it("cancel adding new list", () => {
    cy.get('.add_button').should('be.disabled')
    cy.get('input[formcontrolname="name"]').type("test list I don't want to add")
    cy.get('.add_button').should('be.disabled')
    cy.get('input[formcontrolname="date"]').type("2023-01-18")
    cy.get('.add_button').should('not.be.disabled')
    cy.get('.cancel_button').click()
    cy.contains("test list I don't want to add").should('not.exist')
  })

  it('edit list 2', () => {
    cy.contains('test list name 2').parent().parent().find('.edit_button').click()
    cy.get('.editListRow input[formcontrolname="name"]').type("{selectall}{backspace}{selectall}{backspace}test list name 2 edited")
    cy.get('.editListRow input[formcontrolname="date"]').type('{selectall}{backspace}{selectall}{backspace}2022-10-15')
    cy.get('.editList .edit_button').click()
    cy.contains('test list name 2 edited').should('exist')
  })

  it('edit list 3 with cancel', () => {
    cy.contains('test list name 3').parent().parent().find('.edit_button').click()
    cy.get('.editListRow input[formcontrolname="name"]').type("{selectall}{backspace}{selectall}{backspace}test list name 3 edited")
    cy.get('.editListRow input[formcontrolname="date"]').type('{selectall}{backspace}{selectall}{backspace}2022-10-15')
    cy.get('.editList .cancel_button').click()
    cy.contains('test list name 3 edited').should('not.exist')
  })

  it('delete list 2 and 3', () => {
    cy.contains('test list name 2').parent().parent().find('.delete_button').click()
    cy.contains('test list name 3').parent().parent().find('.delete_button').click()
    cy.contains('test list name 2').should('not.exist')
    cy.contains('test list name 3').should('not.exist')
  })
})


describe('items managing', () => {
  it('click on test list 1', () => {
    cy.pause()
    cy.contains('test list name 1').click()
  })

  it('should redirect', () => {
    cy.url().should('includes', 'shopping-list?listId=')
  })

  it('new item by selection', () => {
    cy.get('input[formcontrolname="text"]').focus().get('mat-option').contains('Jabłka').click()
    cy.get('input[formcontrolname="quantity"]').type('{selectall}{backspace}3')
    cy.get('mat-select[formcontrolname="unit"]').click().get('mat-option').contains('kg').click()
    cy.get('#fileInput').selectFile('cypress/fixtures/jablka.jpg')
    cy.get('.add_button').click()
    cy.contains('Jabłka').should('exist')
  })

  it('new item with own name', () => {
    cy.get('input[formcontrolname="text"]').type("Mleko kozie")
    cy.get('input[formcontrolname="quantity"]').type('{selectall}{backspace}2')
    cy.get('mat-select[formcontrolname="unit"]').click().get('mat-option').contains('szt.').click()
    cy.get('.add_button').click()
    cy.contains('Mleko kozie').should('exist')
  })

  it('new item with cancel click', () => {
    cy.get('input[formcontrolname="text"]').type("Item I don't want to add ")
    cy.get('input[formcontrolname="quantity"]').type('{selectall}{backspace}2')
    cy.get('mat-select[formcontrolname="unit"]').click().get('mat-option').contains('szt.').click()
    cy.get('#fileInput').selectFile('cypress/fixtures/jablka.jpg')
    cy.get('.cancel_button').click()
    cy.contains("Item I don't want to add").should('not.exist')
  })

  it('check item 1 and 2', () => {
    cy.contains('Jabłka').parent().find('input[id*="mat-checkbox-"]').click({ force: true })
    cy.contains('Mleko kozie').parent().find('input[id*="mat-checkbox-"]').click({ force: true })
  })

  it('uncheck item 2', () => {
    cy.contains('Mleko kozie').parent().find('input[id*="mat-checkbox-"]').click({ force: true })
  })

  it('edit item 2', () => {
    cy.contains('Mleko kozie').parent().parent().find('.edit_button').click()
    cy.get('.edit_item input[formcontrolname="text"]').type("{selectall}{backspace}Mleko kokosowe")
    cy.get('.edit_item input[formcontrolname="quantity"]').type("{selectall}{backspace}5")
    cy.get('.edit_item #fileInput').selectFile('cypress/fixtures/jablka.jpg')
    cy.get('.edit_item .edit_button').click()
    cy.contains('Mleko kozie').should('not.exist')
    cy.contains('Mleko kokosowe').should('exist')
  })

  it('delete item', () => {
    cy.contains('Mleko kokosowe').parent().parent().find('.delete_button').click()
    cy.contains('Mleko kokosowe').should('not.exist')
  })

  it('back to user lists', () => {
    cy.contains('Twoje listy').click()
    cy.url().should('includes', 'user-lists')
  })

  it('delete list 1 with item', () => {
    cy.contains('test list name 1').parent().parent().find('.delete_button').click()
    cy.contains('test list name 1').should('not.exist')
  })
})


describe('logout', () => {
  it('click logout from navigation', () => {
    cy.pause()
    cy.contains('Wyloguj').click()
    cy.url().should('includes', 'login')
    cy.getCookie('shoppingList').should('have.property', 'value', '')
  })

})
