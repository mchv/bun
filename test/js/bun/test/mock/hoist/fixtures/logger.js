export const logger = {
  info: (...args) => console.log("[INFO]", ...args),
  error: (...args) => console.error("[ERROR]", ...args),
  debug: (...args) => console.log("[DEBUG]", ...args),
};
export default logger;
