describe("Orders API & UI testing", () => {
  const apiUrl = "http://localhost:5044/api/Order"; // API endpoint for orders
  const waitTime = 1500;

  beforeEach(() => {
    cy.visit("/");
    cy.contains("Orders").click();
    cy.url().should("include", "/orders");
    cy.contains("h2", "Order").should("be.visible");
    cy.wait(waitTime);
    
  });
  // IT block  to test order list as empty since theres not data to this point of the test
  it("Display empty list of orders", () => {
  cy.intercept("GET", apiUrl).as("getOrders");

  cy.visit("/");
  cy.contains("Orders").click();
  cy.wait("@getOrders").then(({ response }) => {
    expect(response.statusCode).to.eq(200);
    expect(response.body).to.be.an("array");

    const orders = response.body;
    if (orders.length > 0) {
      orders.forEach((order) => {
        cy.contains(order.productName).should("exist");
      });
    } else {
      cy.contains("li", "Test Product").should("not.exist"); // ensure the list does not contain the test product
    }
  });
});

//it block to test the creation of a new order
  it("Creates a new order", () => {
    const newOrder = {
      id: 1,
      productName: "Test Product",
      quantity: 3,
      status: "Created",
    };

    cy.request("POST", apiUrl, newOrder).then((res) => {
      expect(res.status).to.eq(201);
    });

    cy.reload(); // Refresh the page to see the new order
    cy.contains("li", newOrder.productName).should("exist");
  });

  //it to test updating an order, it has come to my attention that the API only manages status updates
  it("Updates an order", () => {
    const updatedOrder = {
      status: "Updated", //only status is updated bc api only manages status updates
    };

    cy.request("PUT",`${apiUrl}/1`, updatedOrder).should((res) => {
      expect(res.status).to.eq(204);
    });
    cy.reload( ); // Refresh the page to see the updated product
    cy.contains(updatedOrder.status).should("exist");
  });


//it block to test deleting an order
  it("Deletes an order", () => {
    const orderIdToDelete = 1;

    cy.request("DELETE", `${apiUrl}/${orderIdToDelete}`).then((res) => {
      expect(res.status).to.eq(204);
    });

    cy.reload();
    cy.contains("li", "Updated").should("not.exist");
  });
//it block to test bulk inserts and deletes
  it("Bulk inserts and deletes orders", () => {
    const statuses = ["Created", "Progress", "Done"];

    for (let i = 20; i < 25; i++) {
      const order = {
        id: i,
        productName: `Bulk Order ${i}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };

      cy.request("POST", apiUrl, order).then((res) => {
        expect(res.status).to.eq(201);
      });
    }

    cy.reload();
    cy.contains("Bulk Order 24").should("exist");

    for (let i = 20; i < 25; i++) {
      cy.request("DELETE", `${apiUrl}/${i}`).then((res) => {
        expect(res.status).to.eq(204);
      });
    }

    cy.reload();
    cy.contains("Bulk Order 20").should("not.exist");
  });
});
