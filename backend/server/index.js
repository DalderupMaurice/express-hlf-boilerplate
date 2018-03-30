import 'babel-polyfill';

import mongoose from 'mongoose';
import util from 'util';
// config should be imported before importing any other file
import config from '../config/config';
import network from './services/network.service';

import app from '../config/express';
import Logger from '../config/Log';


// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign


// Debug props
const debug = require('debug')('server:index');


// connect to mongo db
if (config.useDb) {
  // plugin bluebird promise in mongoose
  mongoose.Promise = Promise;

  const mongoUri = config.mongo.host;
  mongoose.connect(mongoUri, {server: {socketOptions: {keepAlive: 1}}});
  mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`);
  });

  // print mongoose logs in dev env
  if (config.mongooseDebug) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
  }
}


if (!module.parent) {
  // TODO - remove user registration. This should be handled in frontend (register/login)
  network.initFabric()
    .then(res => {
      Logger().info(`${res.toString()}\n\n`);
      if (res) return network.register('user4', 'org1.department1');
    })
    .then(res => {
      Logger().info(`${res.toString()}\n\n`);
      // listen on port config.port
      app.listen(config.port, () => {
        Logger().info(`server started on port ${config.port} (${config.env})`);
      });
    })
    .catch(err => Logger().info(`${err.message}\n\n`));
}


export default app;
