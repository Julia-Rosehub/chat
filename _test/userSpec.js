process.env.NODE_ENV = "test";

const User = require("../models/user"),
  { expect } = require("chai");

require("../main");

beforeEach(done => {
  User.deleteMany({})
    .then(() => {
      done();
    });
});

describe("SAVE user", () => {
  it("should save user without error", (done) => {
    let testUser = new User({
      name: {
        first: "John",
        last: "Snow",
      },
      email: "john@example.com",
      password: 12345,
      zipCode: 200208,
    });
    testUser.save()
      .then(() => {
        User.find({})
          .then(result => {
            expect(result.length)
              .to.eq(1);
            expect(result[0])
              .to.have.property("_id");
            done();
          });
      });
  });
});