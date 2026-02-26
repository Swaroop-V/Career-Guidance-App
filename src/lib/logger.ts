import log from 'loglevel';

// Set the default logging level based on environment
if (import.meta.env.DEV) {
  log.setLevel('debug');
} else {
  log.setLevel('warn');
}

export const logger = {
  trace: (...msg: any[]) => log.trace(...msg),
  debug: (...msg: any[]) => log.debug(...msg),
  info: (...msg: any[]) => log.info(...msg),
  warn: (...msg: any[]) => log.warn(...msg),
  error: (...msg: any[]) => log.error(...msg),
};
