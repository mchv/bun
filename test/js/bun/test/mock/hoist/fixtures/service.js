import logger from "./logger.js";

export function fetchData(id) {
  logger.info("fetching", id);
  return { id, name: "real-data" };
}

export function processData(data) {
  logger.debug("processing", data);
  return { ...data, processed: true };
}

export default { fetchData, processData };
