describe('The Home Page', () => {
    it('successfully loads', () => {
      cy.visit('http://localhost:3000') // change URL to match your dev URL
      cy.get().click();
    })
  })
  /*describe('DmModal', () => {
    it('renders chat window', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Type your message"]').should('exist');
      cy.contains('Loading...').should('exist');
    });
  
    it('sends a message', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Type your message"]').type('Hello World!');
      cy.get('button').contains('Send').click();
      cy.get('input[placeholder="Type your message"]').should('have.value', '');
    });
  });
  */