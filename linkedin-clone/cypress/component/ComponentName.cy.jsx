describe('LoginForm component', () => {
  it('allows a user to login with valid credentials', () => {
    const email = 'test@example.com';
    const password = 'password123';

    // visit the login page
    cy.visit('/login');

    // enter email and password
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);

    // submit the form
    cy.get('button[type="submit"]').click();

    // check that the user is logged in
    cy.get('.welcome-message').should('contain', 'Welcome, John Doe!');
  });

  it('shows an error message for invalid credentials', () => {
    const email = 'test@example.com';
    const password = 'invalidpassword';

    // visit the login page
    cy.visit('/login');

    // enter email and password
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);

    // submit the form
    cy.get('button[type="submit"]').click();

    // check that an error message is shown
    cy.get('.error-message').should('contain', 'Invalid email or password');
  });
});
