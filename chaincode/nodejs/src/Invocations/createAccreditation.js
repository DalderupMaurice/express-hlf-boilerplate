async function createAccreditation(stub, args) {
  // TODO don't hardcode
  if (args.length != 2) {
    throw new Error('Incorrect number of arguments. Expecting 2');
  }

  // Todo create parser to extract key and value object
  // TODO input value object - validate + return final object
  // const key = args[0];
  // const { name, reference, website, characteristics, competences, start, providerId, isValid } = args;

  const accreditation = {
    docType: 'accreditation',
    courseId: args[1],
    isRevoked: false,
    revokeDate: null
  };

  await stub.putState(args[0], Buffer.from(JSON.stringify(accreditation)));
}

module.exports = createAccreditation;
