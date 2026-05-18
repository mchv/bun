export const config = {
  apiUrl: "https://real-api.example.com",
  timeout: 5000,
  retries: 3,
};

export function getConfig(key) {
  return config[key];
}

export default config;
