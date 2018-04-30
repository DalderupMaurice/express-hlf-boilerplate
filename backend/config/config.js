import Joi from "joi";

// require and configure dotenv, will load vars in .env in PROCESS.ENV
import dotenv from "dotenv";

dotenv.config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(["development", "production", "test", "provision"])
    .default("development"),
  PORT: Joi.number().default(3000),
  MONGOOSE_DEBUG: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("development"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string()
    .required()
    .description("JWT Secret required to sign"),
  MONGO_HOST: Joi.string()
    .required()
    .description("Mongo DB host url"),
  MONGO_HOST_TEST: Joi.string()
    .required()
    .description("Mongo DB test host url"),
  MONGO_PORT: Joi.number().default(27017),
  USE_DB: Joi.boolean().default(false),
  ORG_MSP: Joi.string()
    .required()
    .description('The name of the Membership Service Provider. Ex: "Org1MSP"'),
  CHANNEL_NAME: Joi.string()
    .required()
    .description('The name of the Channel. Ex: "mychannel"'),
  CHAINCODE_NAME: Joi.string()
    .required()
    .description('The name of the chaincode package. Ex: "my-chaincode"'),
  CA_DOMAIN: Joi.string()
    .required()
    .description('The domain of the Certificate Authorithy. Ex: "ca.example.com"'),
  EVENTHUB: Joi.string()
    .required()
    .description('The endpoint of any EventHub (Peer address). Ex: "http://localhost:7053"'),
  PEER1: Joi.string()
    .required()
    .description('The endpoint of any peer (Can be multiple.. PEER2, PEER3,..). Ex: "http://localhost:7050"'),
  ORDERER1: Joi.string()
    .required()
    .description('The endpoint of any orderer (Can be multiple.. ORDERER2, ORDERER3,..). Ex: "http://localhost:7051"')
})
  .unknown()
  .required();

const _Joi$validate = Joi.validate(process.env, envVarsSchema);
const { error } = _Joi$validate;
const envVars = _Joi$validate.value;

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  },
  mongo_test: envVars.MONGO_HOST_TEST,
  useDb: envVars.USE_DB,
  ORG_MSP: envVars.ORG_MSP,
  CHANNEL_NAME: envVars.CHANNEL_NAME,
  CHAINCODE_NAME: envVars.CHAINCODE_NAME,
  CA_DOMAIN: envVars.CA_DOMAIN,
  CA_URL: envVars.CA_URL,
  PEERS: [envVars.PEER1],
  ORDERERS: [envVars.ORDERER1],
  EVENTHUB: envVars.EVENTHUB,
  APP_HOME: envVars.APP_HOME,
  AUTH0: {
    ACCESS_SCOPE: envVars.AUTH0_ACCESS_SCOPE,
    ACCESS_TYPE: envVars.AUTH0_ACCESS_TYPE,
    CALLBACK: envVars.AUTH0_CALLBACK,
    CLIENT_ID: envVars.AUTH0_CLIENT_ID,
    CLIENT_SECRET: envVars.AUTH0_CLIENT_SECRET,
    DOMAIN: envVars.AUTH0_DOMAIN,
    GRANT_TYPE: envVars.AUTH0_GRANT_TYPE,
    LOGOUT: envVars.AUTH0_LOGOUT,
    TOKEN_URL: envVars.AUTH0_TOKEN_URL
  }
};

export default config;
