type LogLevel = "debug" | "info" | "warn" | "error";

const levels: LogLevel[] = ["debug", "info", "warn", "error"];

const currentLevelIndex = levels.indexOf(
  (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || "debug"
);

function shouldLog(level: LogLevel): boolean {
  return levels.indexOf(level) >= currentLevelIndex;
}

const logger = {
  debug: (message: string, ...optionalParams: any[]) => {
    if (shouldLog("debug")) {
      console.debug(`[DEBUG] ${message}`, ...optionalParams);
    }
  },
  info: (message: string, ...optionalParams: any[]) => {
    if (shouldLog("info")) {
      console.info(`[INFO] ${message}`, ...optionalParams);
    }
  },
  warn: (message: string, ...optionalParams: any[]) => {
    if (shouldLog("warn")) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  },
  error: (message: string, ...optionalParams: any[]) => {
    if (shouldLog("error")) {
      console.error(`[ERROR] ${message}`, ...optionalParams);
    }
  },
};

export default logger;
