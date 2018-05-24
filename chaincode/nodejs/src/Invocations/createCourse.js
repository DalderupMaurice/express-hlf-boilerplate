async function createCourse(stub, args) {
    // TODO don't hardcode
    if (args.length != 9) {
      throw new Error('Incorrect number of arguments. Expecting 9');
    }

    // Todo create parser to extract key and value object
    // TODO input value object - validate + return final object
    // const key = args[0];
    // const { name, reference, website, characteristics, competences, start, providerId, isValid } = args;
    
    const course = {
      docType: 'course',
      name: args[1],
      reference: args[2],
      website: args[3],
      characteristics: args[4],
      competences: args[5],
      start: args[6],
      providerId: args[7],
      isValid: args[8]
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(course)));
  }

  module.exports = createCourse;