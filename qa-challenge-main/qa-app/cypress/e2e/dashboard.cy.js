describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.visit('/'); // Ensure we start from the homepage
    cy.contains('Dashboard').click(); // Navigate to the dashboard
    cy.url().should('include', '/dashboard'); // Verify the URL
    cy.contains('h2', 'Dashboard').should('be.visible'); // Check for the presence of the dashboard header
  });
//it block to test if the dashboard loads correctly, it only
  it('Should load dashboard', () => {
    cy.contains('Dashboard').should('exist');
    cy.contains("h2", "Dashboard").should("be.visible");
    cy.contains('Welcome to the user dashboard!').should('be.visible');

  });
}); 