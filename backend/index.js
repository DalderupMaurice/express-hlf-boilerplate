'use strict';
import mongoose from 'mongoose';
import util from 'util';

// config should be imported before importing any other file
import config from './config/config';

import app from './config/express';

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// Debug props
const debug = require('debug')('server:index');


// connect to mongo db
if(config.useDb) {
  // plugin bluebird promise in mongoose
  mongoose.Promise = Promise;

  const mongoUri = config.mongo.host;
  mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
  mongoose.connection.on('error',() => {
    throw new Error('unable to connect to database: ' + mongoUri);
  });

  // print mongoose logs in dev env
  if (config.mongooseDebug) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      debug(collectionName + '.' + method, util.inspect(query, false, 20), doc);
    });
  }
}


if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info('server started on port ' + config.port + ' (' + config.env + ')'); // eslint-disable-line no-console
  });
}

export default app;
