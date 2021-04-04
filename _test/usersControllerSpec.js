const chai = require('chai');
const { expect } = chai;

const usersController = require('../controllers/usersController');

describe('usersController', () => {
  describe('getUsersParams', () => {
    it('should convert request body to contain the name attributes of the user object', () => {
      const body = {
        first: "John",
        last: "Snow",
        email: "john@example.com",
        password: 12345,
        zipCode: 200700,
      };
      expect(usersController.getUserParams(body))
        .to.deep.include({
          name: {
            first: 'John',
            last: 'Snow'
          }
        });
    });
  });

  it("should return an empty object with empty request body input", () => {
    const emptyBody = {};
    expect(usersController.getUserParams(emptyBody))
      .to.deep.include({});
  });
});
