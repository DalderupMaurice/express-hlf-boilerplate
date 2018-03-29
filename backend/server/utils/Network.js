import path from 'path';
import os from 'os';
import Fabric_Client from 'fabric-client'; // eslint-disable-line
import Fabric_CA_Client from 'fabric-ca-client'; // eslint-disable-line
import Logger from '../services/Log';
import config from '../../config/config';

export default class Network {
  constructor() {
    if (!Network.instance) {
      // Create new fabric client instance
      this.fabricClient = new Fabric_Client();
      this.fabricCaClient = null;
      this.channel = null;
      this.adminUser = null;
      this.memberUser = null;

      this.channelName = config.CHANNEL_NAME;

      this.peers = config.PEERS;
      this.orderers = config.ORDERERS;

      this.CA_NAME = config.CA_NAME;
      this.CA_URL = config.CA_URL;

      this.ORG_MSP = config.ORG_MSP;
      Network.instance = this;
    }

    return Network.instance;
  }


  getFabricInstance = () => this.fabricClient;
  getChannel = () => this.channel;


  initFabric = async (CA_NAME = this.CA_NAME, CA_URL = this.CA_URL) => {
    // setup the fabric network
    this.channel = this.fabricClient.newChannel(this.channelName);


    // Add peers
    this.peers.map(peer => {
      const currentPeer = this.fabricClient.newPeer(peer);
      this.channel.addPeer(currentPeer);
    });


    // Add orderers
    this.orderers.map(orderer => {
      const currentOrderer = this.fabricClient.newOrderer(orderer);
      this.channel.addOrderer(currentOrderer);
    });


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
      // TODO no hardcoding
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
      Logger('NETWORK').info(`Returning from storage, ${userFromStore._name} is already enrolled.`);
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
