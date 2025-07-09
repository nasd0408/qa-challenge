
let delay = 1000;
//reusable function to handle login
// This function will visit the homepage, click on the login button, fill in the data provided, and submit the form.
const login = (username = '', password = '') => {
  cy.visit('/');
  cy.contains('Login').click();
  cy.get('h2').should('contain', 'Login');
  if (username) cy.get('input[type=text]').type(username);
  if (password) cy.get('input[type=password]').type(password);
  cy.intercept('POST', '/api/User/login').as('loginRequest');
  cy.contains("button", "Login").click();
};

describe('Login UI + API Tests', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.wait(delay);
  });

  it('Logs in successfully with valid credentials', () => {
    login('testuser', 'password');

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.contains('Logged in with token').should('be.visible');
  });

  it('Fails login with wrong password', () => {
    login('testuser', 'wrongpass');

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

    cy.contains('Login failed').should('be.visible');
  });

  it('Fails login with wrong username', () => {
    login('wronguser', 'password');

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

    cy.contains('Login failed').should('be.visible');
  });

  it('Fails login with both fields incorrect', () => {
    login('wronguser', 'wrongpass');

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

    cy.contains('Login failed').should('be.visible');
  });

  it('Fails login with empty password', () => {
    login('testuser', '');

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

    cy.contains('Login failed').should('be.visible');
  });

  it('Fails login with empty username', () => {
    login('', 'password');

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

    cy.contains('Login failed').should('be.visible');
  });

  it('Fails login with both fields empty', () => {
    login('', '');

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

    cy.contains('Login failed').should('be.visible');
  });

});
