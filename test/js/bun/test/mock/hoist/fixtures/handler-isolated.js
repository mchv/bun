import db from "./database-isolated.js";
import logger from "./logger-isolated.js";

export async function handleRequest(id) {
  logger.info("handling request", id);
  const results = db.query(`SELECT * FROM items WHERE id = ${id}`);
  return { results };
}
