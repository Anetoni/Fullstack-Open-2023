describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testaaja McLoving',
      username: 'mcloving',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  //5.17
  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  //5.18
  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mcloving')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Testaaja McLoving logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mcloving')
      cy.get('#password').type('notsecret')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Testaaja McLoving logged in')
    })
  })

  //5.19
  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('mcloving')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Testaaja McLoving logged in')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Cypress Testing is fun')
      cy.get('#author').type('Testaaja McLoving')
      cy.get('#url').type('McLovingBlogs.com')

      cy.get('#submit-button').click()
      cy.contains('Cypress Testing is fun by Testaaja McLoving')
    })

    describe('When a blog is created', function() {
      beforeEach(function() {
        cy.contains('new blog').click()
        cy.get('#title').type('Initial blog')
        cy.get('#author').type('Testaaja McLoving')
        cy.get('#url').type('McLovingBlogs.com')

        cy.get('#submit-button').click()
      })

      //5.20
      it('a blog can be liked', function() {
        cy.get('#view-button').click()
        cy.get('#like-button').click()
        cy.contains('likes 1')
      })

      //5.21
      it('blog adder can delete blog', function() {
        cy.get('#view-button').click()
        cy.get('#delete-button').click()
        cy.on('window:confirm', () => true)

        cy.should('not.contain', 'Initial blog by Testaaja McLoving')
      })

      //5.22
      it('only blog adder can see delete button', function() {
        cy.get('#logout-button').click()
        const user = {
          name: 'Secondary User',
          username: 'secouser',
          password: 'sala'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:5173')

        cy.get('#username').type('secouser')
        cy.get('#password').type('sala')
        cy.get('#login-button').click()

        cy.contains('Secondary User logged in')

        cy.get('#view-button').click()
        cy.get('#delete-button').should('not.exist')
      })
    })
  })
})