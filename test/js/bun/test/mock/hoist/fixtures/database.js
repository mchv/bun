export const db = {
  query: (sql) => [{ id: 1, value: "real-db-result" }],
  transaction: () => ({ commit: () => {}, rollback: () => {} }),
};

export class Model {
  static findAll() { return []; }
  static findOne() { return null; }
  static create(data) { return { id: 1, ...data }; }
  static update(data) { return [1]; }
}

export default db;
