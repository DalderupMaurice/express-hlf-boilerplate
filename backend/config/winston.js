import winston from 'winston';

const logger = new winston.Logger({
  transports: [new winston.transports.Console({
    json: true,
    colorize: true,
    prettyPrint: true,
    humanReadableUnhandledException: true,
  })]
});

export default logger;
