import { fetchData } from "./service.js";
import db from "./database.js";
import logger from "./logger.js";

export async function handleRequest(id) {
  logger.info("handling request", id);
  const data = fetchData(id);
  const results = db.query(`SELECT * FROM items WHERE id = ${id}`);
  return { data, results };
}

export function getStatus() {
  return "real-status";
}
