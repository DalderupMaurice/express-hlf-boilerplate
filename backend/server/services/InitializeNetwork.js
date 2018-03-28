import path from 'path';
import os from 'os';
import Fabric_Client from 'fabric-client'; // eslint-disable-line
import Fabric_CA_Client from 'fabric-ca-client'; // eslint-disable-line

const fabricClient = new Fabric_Client();
const storePath = path.join(os.homedir(), '.hfc-key-store');

let fabricCaClient = null;
let adminUser = null;
let memberUser = null;

export default class InitializeNetwork {
  constructor() {
    this.enrollAdmin()
      // eslint-disable-next-line
      .then(res => console.log(res)) 
      // eslint-disable-next-line
      .catch(err => console.log(`${err}
       ${'Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
      'Try again after deleting the contents of the store directory: '} ${storePath}`));
  }

  enrollAdmin = async () => {
    // Create Key-Value store
    const stateStore = await Fabric_Client.newDefaultKeyValueStore({ path: storePath })
      .catch(err => Promise.reject(err));


    // assign the store to the fabric client
    fabricClient.setStateStore(stateStore);


    // Create new crypto suite
    const cryptoSuite = Fabric_Client.newCryptoSuite();


    // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    const cryptoStore = Fabric_Client.newCryptoKeyStore({ path: storePath });
    cryptoSuite.setCryptoKeyStore(cryptoStore);
    fabricClient.setCryptoSuite(cryptoSuite);
    const tlsOptions = {
      trustedRoots: [],
      verify: false
    };


    // be sure to change the http to https when the CA is running TLS enabled
    fabricCaClient = new Fabric_CA_Client('http://localhost:7054', tlsOptions, 'ca.example.com', cryptoSuite);


    // first check to see if the admin is already enrolled
    const userFromStore = await fabricClient.getUserContext('admin', true)
      .catch(err => Promise.reject(err));


    // Assign admin
    if (userFromStore && userFromStore.isEnrolled()) {
      adminUser = userFromStore;
      const result = await this.registerUser();
      return Promise.resolve(result);
    }


    // If admin is not yet enrolled/persisted, we need to enroll it with CA server
    const enrollment = await fabricCaClient.enroll({
      enrollmentID: 'admin',
      enrollmentSecret: 'adminpw'
    });


    // Create the admin user
    adminUser = await fabricClient.createUser({
      username: 'admin',
      mspid: 'Org1MSP',
      cryptoContent: {
        privateKeyPEM: enrollment.key.toBytes(),
        signedCertPEM: enrollment.certificate
      }
    });


    // Set context to the admin
    const context = await fabricClient.setUserContext(adminUser, false);
    if (context) {
      const result = await this.registerUser();
      return Promise.resolve(result);
    }
    return Promise.reject(context);
  };

  registerUser = async () => {
    const secret = await fabricCaClient.register({
      enrollmentID: 'user1',
      affiliation: 'org1.department1'
    }, adminUser)
      .catch(err => Promise.reject(err));


    // next we need to enroll the user with CA server
    // console.log(`Successfully registered user1 - secret:${secret}`);


    // Enroll the user
    const enrollment = await fabricCaClient.enroll({
      enrollmentID: 'user1', enrollmentSecret: secret
    })
      .catch(err => Promise.reject(err));


    // Create the user
    memberUser = await fabricClient.createUser({
      username: 'user1',
      mspid: 'Org1MSP',
      cryptoContent: {
        privateKeyPEM: enrollment.key.toBytes(),
        signedCertPEM: enrollment.certificate
      }
    });


    // Set user context to the new user
    const result = await fabricClient.setUserContext(memberUser, false);
    return Promise.resolve(result);
  }
}
