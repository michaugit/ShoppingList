describe('Register', () => {
  it('should start at login page ', () => {
    cy.visit('http://localhost:4200')
    cy.url().should('includes', 'login')
  })


  it('click on register should redirect to register page ', () => {
    cy.contains('Rejestracja').click()
    cy.url().should('includes', 'register')
    cy.get('.register-btn').should('be.disabled')
  })

  it('propely filled form should be valid', () => {
    cy.get('.register-btn').should('be.disabled')

    cy.get('input[formcontrolname="username"]').type("testuseraccount")
    cy.get('input[formcontrolname="password"]').type("password")
    cy.get('input[formcontrolname="passwordRepeat"]').type("pasword")

    cy.get('.register-btn').should('be.disabled')

    cy.get('input[formcontrolname="passwordRepeat"]').type('{selectall}{backspace}{selectall}{backspace}')
    cy.get('input[formcontrolname="passwordRepeat"]').type("password")

    cy.get('.register-btn').should('not.be.disabled')
  })

  it('after click register should appear sweetalert', () => {
    cy.pause()
    cy.get('.register-btn').click()
    cy.get('.swal2-container').should('be.visible')   
  })

  it('click ok should redirect to login page', () => {
    cy.get('button.swal2-confirm.swal2-styled').click()
    cy.url().should('includes', 'login')  
  })



})