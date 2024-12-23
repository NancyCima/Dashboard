interface Config {
  API_URL: string;
  API_TIMEOUT: number;
}

const config: Config = {
  API_URL: 'https://sql.distrimar.com.ar:4443/api',
  API_TIMEOUT: 30000,
};

export default config;