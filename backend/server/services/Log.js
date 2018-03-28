import { Logger, transports } from 'winston';

const Log = (label = 'FABRIC') => new Logger({
  transports: [new transports.Console({
    level: 'debug',
    prettyPrint: true,
    handleExceptions: true,
    json: false,
    label,
    colorize: true,
  })],
  exitOnError: false,
});

export default Log;
