import path from 'path';
import os from 'os';
import Fabric_Client from 'fabric-client'; // eslint-disable-line
import Fabric_CA_Client from 'fabric-ca-client'; // eslint-disable-line
import Logger from '../services/Log';


export default class Network {
  constructor(CA_NAME = 'ca.example.com', CA_URL = 'http://localhost:7054', ORG_MSP = 'Org1MSP') {
    // Create new fabric client instance
    this.fabricClient = new Fabric_Client();
    this.fabricCaClient = null;
    this.adminUser = null;
    this.memberUser = null;

    this.CA_NAME = CA_NAME;
    this.CA_URL = CA_URL;
    this.ORG_MSP = ORG_MSP;
  }


  initFabric = async (CA_NAME = this.CA_NAME, CA_URL = this.CA_URL) => {
    // Define storepath
    const storePath = path.join(os.homedir(), '.hfc-key-store');
    Logger('NETWORK').info(`Store path is located at: ${storePath}`);

    // Set new crypto suite
    const cryptoSuite = Fabric_Client.newCryptoSuite();
    this.fabricClient.setCryptoSuite(cryptoSuite);


    // Set default key-value store to storePath
    const stateStore = await Fabric_Client.newDefaultKeyValueStore({ path: storePath });
    this.fabricClient.setStateStore(stateStore);


    // Set crypto keystore to storePath
    const cryptoStore = Fabric_Client.newCryptoKeyStore({ path: storePath });
    cryptoSuite.setCryptoKeyStore(cryptoStore);


    const tlsOptions = {
      trustedRoots: [],
      verify: false
    };

    // Set Fabric Certificate Authority client
    // be sure to change the http to https when the CA is running TLS enabled
    this.fabricCaClient = new Fabric_CA_Client(CA_URL, tlsOptions, CA_NAME, cryptoSuite);


    // Check if admin is enrolled
    const userFromStore = await this.fabricClient.getUserContext('admin', true);


    // If admin exists, set admin
    // Else enroll admin and set admin
    if (userFromStore && userFromStore.isEnrolled()) {
      this.adminUser = userFromStore;
    } else {
      this.adminUser = await this.register('admin', 'org1.department1', 'adminpw');
    }


    // Return statement
    return Promise.resolve(this.adminUser);
  };


  register = async (user, org, secret = null) => {
    // Check is user is already enrolled or not
    const userFromStore = await this.fabricClient.getUserContext(user, true);


    // If user is already enrolled, return
    if (userFromStore && userFromStore.isEnrolled()) {
      Logger('NETWORK').info('User already enrolled. Returning from storage..');
      return Promise.resolve(userFromStore);
    }


    // If secret is given, use that. Else register and create secret
    if (!secret) {
      // eslint-disable-next-line no-param-reassign
      secret = await this.fabricCaClient.register({
        enrollmentID: user,
        affiliation: org
      }, this.adminUser).catch(err => Promise.reject(err));
    }


    // Enroll the user
    const enrollment = await this.fabricCaClient.enroll({
      enrollmentID: user,
      enrollmentSecret: secret
    }).catch(err => Promise.reject(err));


    // Create the user
    this.memberUser = await this.fabricClient.createUser({
      username: user,
      mspid: this.ORG_MSP,
      cryptoContent: {
        privateKeyPEM: enrollment.key.toBytes(),
        signedCertPEM: enrollment.certificate
      }
    });


    // Set user context to the new user
    const userInStorage = await this.fabricClient.setUserContext(this.memberUser, false);
    this.memberUser = userInStorage;


    // Return statement
    return Promise.resolve(userInStorage);
  };
}
