import Network from '../utils/Network';
import Logger from '../services/Log';


const validateUser = userContext => !!(userContext && userContext.isEnrolled());

export default class ChaincodeService {
  constructor() {
    this.network = null;
    this.fabricClient = null;
    this.channel = null;
  }

  // TODO no hardconding
  invoke = (user = 'user1') => new Promise((async (resolve, reject) => {
    this.network = new Network();
    this.fabricClient = this.network.getFabricInstance();
    this.channel = this.network.getChannel();

    const userContext = await this.fabricClient.getUserContext(user, true)
      .catch(err => reject(err));
    if (!validateUser(userContext)) reject(new Error('User not yet enrolled.'));

    const txId = this.fabricClient.newTransactionID();

    const request = {
      // targets: let default to the peer assigned to the client
      chaincodeId: 'watchmovement-app', // TOOD config
      fcn: '',
      args: [''],
      chainId: 'mychannel', // TOOD CONFIG
      txId
    };


    const proposalResult = await this.fabricClient.channel.sendTransactionProposal(request);
    Logger('prop').info(proposalResult);
  }))
}
