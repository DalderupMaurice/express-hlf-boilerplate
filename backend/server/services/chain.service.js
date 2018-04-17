import httpStatus from 'http-status';

import network from './network.service';
import Logger from '../../config/Log';
import * as labels from '../../config/labels';
import config from '../../config/config';
import APIError from '../utils/APIError';

const validateUser = userContext => !!(userContext && userContext.isEnrolled());

export default class ChaincodeService {
  constructor() {
    this.fabricClient = null;
    this.channel = null;
    this.eventHub = null;
  }


  prepareRequest = (user, functionName, funcArgs = [''], invocation = true) => new Promise((async (resolve, reject) => {
    this.fabricClient = network.getFabricClient();
    this.channel = network.getChannel();

    const userContext = await this.fabricClient.getUserContext(user, true)
      .catch(err => reject(err));
    if (!validateUser(userContext)) return reject(new Error('User not yet enrolled.'));

    const txId = this.fabricClient.newTransactionID();

    const request = {
      // targets: let default to the peer assigned to the client
      chaincodeId: config.CHAINCODE_NAME,
      fcn: functionName,
      args: funcArgs,
    };

    if (invocation) resolve(Object.assign(request, { txId, chainId: config.CHANNEL_NAME }));
    resolve(request);
  }));


  query = async request => new Promise((async (resolve, reject) => {
    const queryResult = await this.channel.queryByChaincode(request)
      .catch(err => reject(err));

    if (!(queryResult && queryResult.length === config.PEERS.length)) {
      return reject(new APIError('No payloads were returned from query', httpStatus.BAD_REQUEST));
    }

    if (queryResult[0] instanceof Error) {
      return reject(new APIError(`Error from query: ${queryResult[0].message} `, httpStatus.BAD_REQUEST));
    }

    try {
      const parsedResult = JSON.parse(queryResult[0].toString());
      resolve(parsedResult);
    } catch (e) {
      return reject(new APIError(`Failed to parse: ${e.message}`, httpStatus.INTERNAL_SERVER_ERROR));
    }
  }));


  invoke = request => new Promise((async (resolve, reject) => {
    const proposalResult = await this.channel.sendTransactionProposal(request)
      .catch(err => reject(err));

    const proposalResponses = proposalResult[0];
    const proposal = proposalResult[1];

    if (!(proposalResponses
      && proposalResponses[0].response
      && proposalResponses[0].response.status === 200)) {
      return reject(new Error('Transaction proposal was bad'));
    }

    const result = await this.processProposal(proposal, proposalResponses, request.txId);

    resolve(result);
  }));


  processProposal = async (proposal, proposalResponses, txId) => {
    this.eventHub = network.getEventHub();
    const txIdString = txId.getTransactionID();

    Logger(labels.PROPOSAL).info(`Successfully sent Proposal and received ProposalResponse: 
        Status - ${proposalResponses[0].response.status}
        message - "${proposalResponses[0].response.message}"`);

    // build up the request for the orderer to have the transaction committed
    const request = {
      proposalResponses,
      proposal
    };

    const transaction = await this.channel.sendTransaction(request);

    this.eventHub.connect();
    const eventPromise = new Promise(async (resolve, reject) => {
      this.eventHub.registerTxEvent(txIdString, (tx, statusCode) => {
        this.eventHub.unregisterTxEvent(txIdString);
        this.eventHub.disconnect();

        const returnStatus = { statusCode, tx };
        if (statusCode !== 'VALID') {
          return reject(new Error(`Problem with the tranaction, event status ::${statusCode}`));
        }
        Logger(labels.TRANSACTION).info(`The transaction has been committed on peer ${this.eventHub._ep._endpoint.addr}`);
        resolve(returnStatus);
      }, err => {
        this.eventHub.disconnect();
        return reject(new Error(`There was a problem with the eventhub ::${err}`));
      });
    });

    const eventResult = await eventPromise;
    return { ...transaction, ...eventResult };
  }
}
