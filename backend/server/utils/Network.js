import path from 'path';
import os from 'os';
import Fabric_Client from 'fabric-client'; // eslint-disable-line
import Fabric_CA_Client from 'fabric-ca-client'; // eslint-disable-line
import Logger from '../services/Log';
import config from '../../config/config';

const fabricClient = new Fabric_Client();
let fabricCaClient = null;
let channel = null;
let eventHub = null;
let adminUser = null;
let memberUser = null;

const {
  CHANNEL_NAME,
  PEERS,
  ORDERERS,
  CA_DOMAIN,
  CA_URL,
  ORG_MSP,
  EVENTHUB
} = config;

// TODO - deleting the keys without network restart register() fails => user already registered
// TODO - question: WHAT is the secret after registration and you want to retrieve your user
const register = async (user, org, secret = null) => {
  // Check is user is already enrolled or not
  const userFromStore = await fabricClient.getUserContext(user, true);


  // If user is already enrolled, return
  if (userFromStore && userFromStore.isEnrolled()) {
    Logger('NETWORK').info(`Returning from storage, ${userFromStore._name} is already enrolled.`);
    return Promise.resolve(userFromStore);
  }


  // If secret is given, use that. Else register and create secret
  if (!secret) {
    // eslint-disable-next-line no-param-reassign
    secret = await fabricCaClient.register({
      enrollmentID: user,
      affiliation: org
    }, adminUser).catch(err => Promise.reject(new Error(`${err}. Please sign in`)));
  }


  // Enroll the user
  const enrollment = await fabricCaClient.enroll({
    enrollmentID: user,
    enrollmentSecret: secret
  }).catch(err => Promise.reject(err));


  // Create the user
  memberUser = await fabricClient.createUser({
    username: user,
    mspid: ORG_MSP,
    cryptoContent: {
      privateKeyPEM: enrollment.key.toBytes(),
      signedCertPEM: enrollment.certificate
    }
  });


  // Set user context to the new user
  const userInStorage = await fabricClient.setUserContext(memberUser, true);
  memberUser = userInStorage;


  // Return statement
  return Promise.resolve(userInStorage);
};


const initFabric = async () => {
  // setup the fabric network
  channel = fabricClient.newChannel(CHANNEL_NAME);


  // Add peers
  PEERS.map(peer => {
    const currentPeer = fabricClient.newPeer(peer);
    channel.addPeer(currentPeer);
  });


  // Add orderers
  ORDERERS.map(orderer => {
    const currentOrderer = fabricClient.newOrderer(orderer);
    channel.addOrderer(currentOrderer);
  });

  // Add event hub
  eventHub = fabricClient.newEventHub();
  eventHub.setPeerAddr(EVENTHUB);


  // Define storepath
  const storePath = path.join(os.homedir(), '.hfc-key-store');
  Logger('NETWORK').info(`Store path is located at: ${storePath}`);

  // Set new crypto suite
  const cryptoSuite = Fabric_Client.newCryptoSuite();
  fabricClient.setCryptoSuite(cryptoSuite);


  // Set default key-value store to storePath
  const stateStore = await Fabric_Client.newDefaultKeyValueStore({ path: storePath });
  fabricClient.setStateStore(stateStore);


  // Set crypto keystore to storePath
  const cryptoStore = Fabric_Client.newCryptoKeyStore({ path: storePath });
  cryptoSuite.setCryptoKeyStore(cryptoStore);


  const tlsOptions = {
    trustedRoots: [],
    verify: false
  };

  // Set Fabric Certificate Authority client
  // be sure to change the http to https when the CA is running TLS enabled
  fabricCaClient = new Fabric_CA_Client(CA_URL, tlsOptions, CA_DOMAIN, cryptoSuite);


  // Check if admin is enrolled
  const userFromStore = await fabricClient.getUserContext('admin', true);


  // If admin exists, set admin
  // Else enroll admin and set admin
  if (userFromStore && userFromStore.isEnrolled()) {
    adminUser = userFromStore;
  } else {
    // TODO no hardcoding
    adminUser = await register('admin', 'org1.department1', 'adminpw'); // eslint-disable-line
  }

  // Return statement
  return Promise.resolve(adminUser);
};


const getFabricClient = () => fabricClient;
const getChannel = () => channel;
const getEventHub = () => eventHub;

export default {
  getFabricClient,
  getChannel,
  getEventHub,
  initFabric,
  register
};
