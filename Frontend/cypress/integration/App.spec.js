describe("Navbar loads correctly", () => {
  it("Renders correctly", () => {
    cy.visit("/");
    cy.get("#navbar").should("exist");
  });
});
