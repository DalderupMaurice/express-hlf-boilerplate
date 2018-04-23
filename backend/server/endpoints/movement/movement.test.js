import mongoose from "mongoose";
import request from "supertest-as-promised";
import httpStatus from "http-status";
import chai from "chai";

import config from "../../../config/config";
import app from "../../index";

// const { expect } = chai;
chai.config.includeStack = true;

const clearDB = () => {
  mongoose.connect(config.mongo_test, () => {
    mongoose.connection.db.dropDatabase(() => {});
  });
};

beforeEach(() => {
  clearDB();
});

/**
 * root level hooks
 */
afterAll(() => {
  clearDB();
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
});

describe("## Movements APIs", () => {
  const validMovementObject = {
    transporter: "TestTransporter",
    holder: "TestHolder",
    location: "TestLocation"
  };

  const invalidMovementObject = {
    transporter: "TestTransporter",
    holder: "TestHolder"
  };

  describe("# POST /api/movement/add", () => {
    it("should add a new movement", done => {
      request(app)
        .post("/api/movement/add")
        .send(validMovementObject)
        .expect(httpStatus.OK)
        .then(() => {
          done();
        })
        .catch(() => {
          done();
        });
    });

    it("should fail #400", done => {
      request(app)
        .post("/api/movement/add")
        .send(invalidMovementObject)
        .expect(httpStatus.BAD_REQUEST)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });
});
