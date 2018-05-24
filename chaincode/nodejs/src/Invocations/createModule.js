async function createModule(stub, args) {
    // TODO don't hardcode
    if (args.length != 7) {
      throw new Error('Incorrect number of arguments. Expecting 7');
    }

    // Todo create parser to extract key and value object
    // TODO input value object - validate + return final object
    // const key = args[0];
    // const { name, reference, website, characteristics, competences, start, providerId, isValid } = args;
    
    const module = {
      docType: 'module',
      courseId: args[1],
      name: args[2],
      reference: args[3],
      credits: args[4],
      content: args[5],
      hours: args[6]
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(module)));
  }

  module.exports = createModule;