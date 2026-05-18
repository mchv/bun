export function fetchData(id) {
  return { id, name: "real-data" };
}
export function processData(data) {
  return { ...data, processed: true };
}
export default { fetchData, processData };
