import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // minimum level to log (info, error, warn, debug, etc.)
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // include stack trace
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),  // errors only
    new transports.File({ filename: "logs/combined.log" }),              // all logs
  ],
});

// If you want console logs during development:
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({
    format: format.combine(format.colorize(), format.simple())
  }));
}

export default logger;
