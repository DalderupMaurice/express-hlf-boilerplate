const moment = require('moment');

async function revokeAccreditation(stub, args) {
  if (args.length !== 1) {
    throw new Error('Incorrect number of arguments. Expecting 1');
  }

  const key = args[0];
  const accreditationAsBytes = await stub.getState(key);
  const accreditation = JSON.parse(accreditationAsBytes);
  accreditation.isRevoked = true;
  accreditation.revokeDate = moment().toNow();

  await stub.putState(key, Buffer.from(JSON.stringify(accreditation)));
}

module.exports = revokeAccreditation;
