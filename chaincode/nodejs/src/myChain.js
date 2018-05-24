'use strict';

const shim = require('fabric-shim');

const initLedger = require('./Invocations/Initialize');

// Course actions
const createCourse = require('./Invocations/createCourse');
const queryAllCourses = require('./Queries/QueryAll');
const queryCourse = require('./Queries/QueryCourse');

// Module actions
const createModule = require('./Invocations/createModule');

// Accreditation actions
const createAccreditation = require('./Invocations/createAccreditation');
const revokeAccreditation = require('./Invocations/revokeAccreditation');


const Chaincode = class {

  async Invoke(stub) {
    const { fcn, params } = stub.getFunctionAndParameters();

    const method = this[fcn];
    if (!method) {
      throw new Error('Received unknown function ' + fcn + ' invocation');
    }

    try {
      const payload = await method(stub, params);
      return shim.success(payload);
    } catch (err) {
      return shim.error(err);
    }
  }


  // The Init method is called when the Smart Contract is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    this.logger = shim.newLogger('odb');

    this["initLedger"] = initLedger;

    // Accreditation actions
    this["revokeAccreditation"] = revokeAccreditation;
    this["createAccreditation"] = createAccreditation;

    // Course actions
    this["createCourse"] = createCourse;
    this["queryCourse"] = queryCourse;
    this["queryAllCourses"] = queryAllCourses;

    // Module actions
    this["createModule"] = createModule;

    return shim.success();
  }
};

shim.start(new Chaincode());
