import { createLogger, format, transports } from "winston";

const getLogger = () => {
  const consoleTransport = new transports.Console({
    level: process.env.NEXT_PUBLIC_LOG_LEVEL || "info",
    handleExceptions: false,
    json: false,
    colorize: true,
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(
        ({ level, message, label = process.env.NODE_ENV, timestamp }) =>
          `${timestamp} [${label}] ${level}: ${message}`,
      ),
    ),
  });

  const logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(
        ({ level, message, label = process.env.NODE_ENV, timestamp }) =>
          `${timestamp} [${label}] ${level}: ${message}`,
      ),
    ),
    defaultMeta: { service: "ceramics-store" },
    transports: [consoleTransport],
  });

  return logger;
};

export default getLogger();
