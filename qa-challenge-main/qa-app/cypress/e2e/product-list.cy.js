let waitTime = 1500;
let apiUrl = "http://localhost:5044/api/product"; // API endpoint for products
describe("Products API & UI testing", () => {
  beforeEach(() => {
    cy.visit("/"); // Start from the homepage
    cy.contains("Products").click(); // Navigate via navbar or link
    cy.url().should("include", "/products");
    cy.contains("h2", "Product").should("be.visible");
    cy.wait(waitTime);
  });

  //IT block to ensure the product list is empty before starting tests
  it("Fetches all products empty", () => {
    cy.request(apiUrl).should((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array");
    });
    cy.contains("li", "Producto 1").should("not.exist"); // Ensure no products are displayed
  });
//IT block to test the creation of a new product
  it("Creates a new product", () => {
    const product = {
      id: 1,
      name: "Producto 1",
      price: 50,
    };

    cy.request("POST", apiUrl, product).should((res) => {
      expect(res.status).to.eq(201);
    });
    cy.visit("/products"); // Refresh the page to see the new product
    cy.contains("li", product.name).should("exist");
  });
// IT Block to fetch all products and ensure the new product is displayed
  it("Fetches all products", () => {
    cy.request(apiUrl).should((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array");
    });
  });
// IT block to fetch a single product by ID to the endpoint, should not have any effect on the UI
  it("Fetches a product by ID", () => {
    const id = 1;
    cy.request(`${apiUrl}/${id}`).should((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.eq(id);
    });
  });

//It block to test updating a product
  it("Updates a product", () => {
    const updatedProduct = {
      name: "Updated",
      price: 80,
    };

    cy.request("PUT", `${apiUrl}/1`, updatedProduct).should((res) => {
      expect(res.status).to.eq(204);
    });
    cy.reload(); // Refresh the page to see the updated product
    cy.contains(updatedProduct.name).should("exist");
  });
//it block to delete a single product
  it("Deletes a single product", () => {
    const productId = 1;

    cy.request("DELETE", `${apiUrl}/${productId}`).should((res) => {
      expect(res.status).to.eq(204);
    });
    cy.reload(); // Refresh the page to see the deletion
    cy.contains(`Product ${productId}`).should("not.exist");
  });
  //it block to test inserting multiple products
  it("Inserts multiple products", () => {
    Cypress._.times(6, (i) => {
      const product = {
        id: 100 + i,
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 90) + 10,
      };

      cy.request("POST", apiUrl, product).should((res) => {
        expect(res.status).to.eq(201);
      });
      cy.visit("/products"); // Refresh the page to see the new products
      cy.contains("li", product.name).should("exist");
    });
  });
//it block to test bulk deletion of products
  it("Deletes multiple products", () => {
    const idsToDelete = [104, 105];

    idsToDelete.forEach((id) => {
      cy.request("DELETE", `${apiUrl}/${id}`).should((res) => {
        expect(res.status).to.eq(204);
      });
      cy.reload(); // Refresh the page to see the deletion
      cy.contains(`Product ${id}`).should("not.exist");
    });
  });
});
