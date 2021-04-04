const chai = require("chai"),
  { expect } = chai,
  usersController = require("../controllers/usersController");

describe("usersController", () => {
  describe("getUserParams", () => {
    it("should convert request body to contain the name attributes of the user object", () => {
      const body = {
        first: "John",
        last: "Snow",
        email: "john@example.com",
        password: 12345,
        zipCode: 200205,
      };
      expect(usersController.getUserParams(body))
        .to.deep.include({
          name: {
            first: "John",
            last: "Snow",
          }
        });
    });

    it("should return an empty object if request body is empty", () => {
      const emptyBody = {};
      expect(usersController.getUserParams(emptyBody))
        .to.deep.include({});
    });
  });
});