const path = require('path');
require('dotenv').config();

const nextConfig = {
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    // Aliases
    config.resolve.alias['@api'] = path.join(__dirname, 'api');
    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    config.resolve.alias['@layouts'] = path.join(__dirname, 'layouts');
    config.resolve.alias['@store'] = path.join(__dirname, 'store');
    config.resolve.alias['@middleware'] = path.join(__dirname, 'middleware');
    config.resolve.alias['@lib'] = path.join(__dirname, 'lib');
    config.resolve.alias['@styles'] = path.join(__dirname, 'styles');

    return config;
  }
};

module.exports = phase => {
  nextConfig.env = {
    API_URL: process.env.API_URL
      ? process.env.API_URL
      : 'https://golfsystem-api.herokuapp.com',
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID
      ? process.env.FACEBOOK_APP_ID
      : '365276184099550',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
      ? process.env.GOOGLE_CLIENT_ID
      : '1036713656661-ecifvnq1kuturu55i7fuh51049bg8o40.apps.googleusercontent.com',
  };

  return nextConfig;
};
