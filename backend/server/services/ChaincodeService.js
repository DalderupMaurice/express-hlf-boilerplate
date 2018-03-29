import network from '../utils/Network';
import Logger from '../services/Log';
import * as labels from '../utils/labels';

const validateUser = userContext => !!(userContext && userContext.isEnrolled());

export default class ChaincodeService {
  constructor() {
    this.fabricClient = null;
    this.channel = null;
    this.eventHub = null;
  }

  // TODO no hardconding
  invoke = (user = 'user4') => new Promise((async (resolve, reject) => {
    this.fabricClient = network.getFabricClient();
    this.channel = network.getChannel();

    const userContext = await this.fabricClient.getUserContext(user, true)
      .catch(err => reject(err));
    if (!validateUser(userContext)) reject(new Error('User not yet enrolled.'));

    const txId = this.fabricClient.newTransactionID();

    // TODO error handling - wrong fcn name
    const request = {
      // targets: let default to the peer assigned to the client
      chaincodeId: 'watchmovement-app', // TODO config
      fcn: 'initLedger',
      args: [''],
      chainId: 'mychannel', // TODO CONFIG
      txId
    };


    const proposalResult = await this.channel.sendTransactionProposal(request)
      .catch(err => reject(err));

    const proposalResponses = proposalResult[0];
    const proposal = proposalResult[1];

    if (!(proposalResponses
      && proposalResponses[0].response
      && proposalResponses[0].response.status === 200)) {
      return reject(new Error('Transaction proposal was bad'));
    }

    const result = await this.processProposal(proposal, proposalResponses, txId);

    resolve(result);
  }));

  processProposal = async (proposal, proposalResponses, txId) => {
    this.eventHub = network.getEventHub();

    Logger('PROPOSAL').info(`Successfully sent Proposal and received ProposalResponse: Status - ${proposalResponses[0].response.status}, message - "${proposalResponses[0].response.message}"`);

    // build up the request for the orderer to have the transaction committed
    const request = {
      proposalResponses,
      proposal
    };

    // set the transaction listener and set a timeout of 30 sec
    // if the transaction did not get committed within the timeout period,
    // report a TIMEOUT status
    // Get the transaction ID string to be used by the event processing
    const txIdString = txId.getTransactionID();

    const transaction = await this.channel.sendTransaction(request);

    this.eventHub.connect();
    const eventPromise = new Promise(async (resolve, reject) => {
      this.eventHub.registerTxEvent(txIdString, (tx, code) => {
        this.eventHub.unregisterTxEvent(txIdString);
        this.eventHub.disconnect();

        // now let the application know what happened
        const returnStatus = { event_status: code, tx_id: txIdString };
        if (code !== 'VALID') {
          reject(new Error(`Problem with the tranaction, event status ::${code}`));
        } else {
          Logger(labels.TRANSACTION).info(`The transaction has been committed on peer ${this.eventHub._ep._endpoint.addr}`);
          resolve(returnStatus);
        }
      }, err => {
        this.eventHub.disconnect();
        // this is the callback if something goes wrong with the event registration or processing
        reject(new Error(`There was a problem with the eventhub ::${err}`));
      });
    });

    const eventResult = await eventPromise;
    return { transaction, eventResult };
  }
}
