
import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
import dotenv from 'dotenv';

dotenv.config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  PORT: Joi.number().default(3000),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string().required().description('Mongo DB host url'),
  MONGO_PORT: Joi.number().default(27017),
  USE_DB: Joi.boolean().default(false)
}).unknown().required();

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
  useDb: envVars.USE_DB,
  ORG_MSP: envVars.ORG_MSP,
  CHANNEL_NAME: envVars.CHANNEL_NAME,
  CA_NAME: envVars.CA_NAME,
  CA_URL: envVars.CA_URL,
  PEERS: [
    envVars.PEER1
  ],
  ORDERERS: [
    envVars.ORDERER1
  ],
  EVENTHUB: envVars.EVENTHUB
};

export default config;
