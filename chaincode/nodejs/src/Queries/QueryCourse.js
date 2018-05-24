async function queryCourse(stub, args) {
  if (args.length != 1) {
    throw new Error('Incorrect number of arguments. Expecting CourseNumber ex: COURSE-01');
  }
  const courseNumber = args[0];

  const courseAsBytes = await stub.getState(courseNumber); //get the course from chaincode state
  if (!courseAsBytes || courseAsBytes.toString().length <= 0) {
    throw new Error(courseNumber + ' does not exist: ');
  }

  return courseAsBytes;
}

module.exports = queryCourse;
