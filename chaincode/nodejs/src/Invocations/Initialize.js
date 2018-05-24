const initialData = require("../models/initialData");

const keyPrefix = 'course-';

async function initLedger(stub, args) {
  const courses = [];

  initialData.map(item => {
    courses.push(item);
  });

  for (let i = 0; i < courses.length; i++) {
    courses[i].docType = 'course';
    await stub.putState(keyPrefix + i, Buffer.from(JSON.stringify(courses[i])));
  }
}


module.exports = initLedger;
