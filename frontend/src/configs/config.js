const properties = {
  base: {},
  dev: {
    home: '',
    home_page_path: '',
    host: 'http://localhost:5020',
  },
  qa: {
    home: '/run-planner',
    home_page_path: 'run-planner',
    projects_endpoint: 'https://<DEV_HOST>/run-planner/api/requests',
    host: '<DEV_HOST>',
  },
  prod: {
    home: '/run-planner',
    home_page_path: 'run-planner',
    projects_endpoint: 'https://<PROD_HOST>/run-planner/api/requests',
    host: '<PROD_HOST>'
  },
};

const env = process.env.REACT_APP_ENV.toLowerCase();
const config = Object.assign(properties.base, properties[env]);
if (env !== 'prod') {
  console.log(`${env} ENVIRONMENT: ${JSON.stringify(config)}`);
}

export const HOME_PAGE_PATH = config.home_page_path;
export const HOME = config.home;
export const BACKEND = config.host;
