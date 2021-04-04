process.env.NODE_ENV = 'test';

const User = require('../models/user'),
  { expect } = require('chai');

require('../main');

beforeEach(done => {
  User.deleteMany({})
    .then(() => {
      done();
    });
});

describe('SAVE user', () => {
  it('should save one user without error', (done) => {
    const testUser = new User({
      name: {
        first: 'John',
        last: 'Snow'
      },
      email: 'john@example.com',
      password: 'password',
      zipCode: 200701,
    });
    testUser.save()
      .then(() => {
        User.find({})
          .then(result => {
            expect(result.length)
              .to.eq(1);
            expect(result[0])
              .to.have.property('_id');
            done();
          });
      });
  });
});

describe("/users GET", () => {
  it("it should GET all the users", (done) => {
    chai.request(app)
      .get("/users")
      .end((errors, res) => {
        expect(res).to.have.status(200);
        expect(errors).to.be.equal(null);
        done();
      });
  });
});