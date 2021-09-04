import winston from 'winston';

export default winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      if (info.stack) {
        return `${info.timestamp} | ${info.level} | ${info.message}\n${info.stack}`;
      }

      return `${info.timestamp} | ${info.level} | ${info.message}`;
    })
  )
});
