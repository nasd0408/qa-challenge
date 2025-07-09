// / This file contains tests for the responsiveness of the application across different viewports.
// It checks that the navigation and page content are displayed correctly on various screen sizes.

const viewports = [// Define common viewports for testing responsiveness
  { label: 'mobile', width: 375, height: 667 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'desktop', width: 1280, height: 800 },
];

const pages = [ // Define the pages to test, not the home page since it does not render anything other than the nav
  { name: 'Products', path: '/products', heading: 'Product' },
  { name: 'Orders', path: '/orders', heading: 'Order' },
  { name: 'Login', path: '/login', heading: 'Login' },
  { name: 'Dashboard', path: '/dashboard', heading: 'Dashboard' },
];

viewports.forEach(({ label, width, height }) => {// Iterate over each viewport configuration
  describe(`Responsiveness - ${label}`, () => {
    beforeEach(() => {
      cy.viewport(width, height);
    });

    it("Displays nav and page content correctly on all routes", () => {
      pages.forEach(({ name, path, heading }) => {//iterate over each page to test
        cy.visit(path);

        pages.forEach((p) => {
          cy.contains("li", name).should("be.visible");
        });

        // Each page (except home) should render its h2 heading
        if (heading) {
          cy.contains("h2", heading).should("be.visible");
        }
      });
    });
  });
});
