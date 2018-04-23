import request from "supertest-as-promised";
import httpStatus from "http-status";
import chai from "chai";

import app from "../../index";

const { expect } = chai;
chai.config.includeStack = true;

describe("## Auth APIs", () => {
  // describe("# POST /api/auth/login", () => {
  //   it("should return Authentication error", done => {
  //     request(app)
  //       .post("/api/auth/login")
  //       .send(invalidUserCredentials)
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then(res => {
  //         expect(res.body.message).to.equal("Authentication error");
  //         done();
  //       })
  //       .catch(done);
  //   });
  //
  //   it("should get valid JWT token", done => {
  //     request(app)
  //       .post("/api/auth/login")
  //       .send(validUserCredentials)
  //       .expect(httpStatus.OK)
  //       .then(res => {
  //         expect(res.body).to.have.property("token");
  //         jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
  //           expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
  //           expect(decoded.username).to.equal(validUserCredentials.username);
  //           jwtToken = `Bearer ${res.body.token}`;
  //           done();
  //         });
  //       })
  //       .catch(done);
  //   });
  // });

  describe("# GET /api/auth/random-number", () => {
    it("Should get a random number", done => {
      request(app)
        .get("/api/auth/random-number")
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.num).to.be.a("number");
          expect(res.body.num).to.not.equal(null);
          done();
        })
        .catch(done);
    });

    //
    //   it("should fail to get random number because of wrong token", done => {
    //     request(app)
    //       .get("/api/auth/random-number")
    //       .set("Authorization", "Bearer inValidToken")
    //       .expect(httpStatus.UNAUTHORIZED)
    //       .then(res => {
    //         expect(res.body.message).to.equal("Unauthorized");
    //         done();
    //       })
    //       .catch(done);
    //   });
    //
    //   it("should get a random number", done => {
    //     request(app)
    //       .get("/api/auth/random-number")
    //       .set("Authorization", jwtToken)
    //       .expect(httpStatus.OK)
    //       .then(res => {
    //         expect(res.body.num).to.be.a("number");
    //         done();
    //       })
    //       .catch(done);
    //   });
  });
});
