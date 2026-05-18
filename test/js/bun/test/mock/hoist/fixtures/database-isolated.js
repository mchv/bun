export const db = {
  query: (sql) => [{ id: 1, value: "real-db-result" }],
  transaction: () => ({ commit: () => {}, rollback: () => {} }),
};
export default db;
