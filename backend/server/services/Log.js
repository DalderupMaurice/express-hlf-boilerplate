import { Logger, transports } from 'winston';

const Log = (label = 'FABRIC', level = 'debug') => new Logger({
  transports: [new transports.Console({
    level,
    prettyPrint: true,
    handleExceptions: true,
    json: false,
    label,
    colorize: true,
  })],
  exitOnError: false,
});

export default Log;
