'use strict';

var request = require('supertest-as-promised');
var httpStatus = require('http-status');
var chai = require('chai'); // eslint-disable-line import/newline-after-import
var expect = chai.expect;
var app = require('../../index');

chai.config.includeStack = true;

describe('## Misc', function () {
  describe('# GET /api/health-check', function () {
    it('should return OK', function (done) {
      request(app).get('/api/health-check').expect(httpStatus.OK).then(function (res) {
        expect(res.text).to.equal('OK');
        done();
      }).catch(done);
    });
  });

  describe('# GET /api/404', function () {
    it('should return 404 status', function (done) {
      request(app).get('/api/404').expect(httpStatus.NOT_FOUND).then(function (res) {
        expect(res.body.message).to.equal('Not Found');
        done();
      }).catch(done);
    });
  });

  describe('# Error Handling', function () {
    it('should handle mongoose CastError - Cast to ObjectId failed', function (done) {
      request(app).get('/api/users/56z787zzz67fc').expect(httpStatus.INTERNAL_SERVER_ERROR).then(function (res) {
        expect(res.body.message).to.equal('Internal Server Error');
        done();
      }).catch(done);
    });

    it('should handle express validation error - username is required', function (done) {
      request(app).post('/api/users').send({
        mobileNumber: '1234567890'
      }).expect(httpStatus.BAD_REQUEST).then(function (res) {
        expect(res.body.message).to.equal('"username" is required');
        done();
      }).catch(done);
    });
  });
});
//# sourceMappingURL=misc.test.js.map
