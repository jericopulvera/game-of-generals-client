const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');
const withCSS = require('@zeit/next-css');
const withPurgeCss = require('next-purgecss');
const withESLint = require('next-eslint');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

const nextConfig = {
  target: 'server',
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    config.plugins = config.plugins || [];
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ];

    // Aliases
    config.resolve.alias['@api'] = path.join(__dirname, 'api');
    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    config.resolve.alias['@layouts'] = path.join(__dirname, 'layouts');
    config.resolve.alias['@store'] = path.join(__dirname, 'store');
    config.resolve.alias['@middleware'] = path.join(__dirname, 'middleware');
    config.resolve.alias['@lib'] = path.join(__dirname, 'lib');
    config.resolve.alias['@styles'] = path.join(__dirname, 'styles');

    return config;
  },
  purgeCssPaths: ['pages/**/*', 'components/**/*', 'layouts/**/*'],
  purgeCss: {
    // Get all css class used in these files to not let it be removed.
    whitelistPatterns: [
      // Patern for react-dates default styling
      /^SingleDatePicker.*$/,
      /^DateInput.*$/,
      /^DayPicker.*$/,
      /^Dropdown.*$/,
      // -- End Patern for react-dates default styling
    ],
    extractors: [
      {
        // Tailwind extractor
        extractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
        extensions: ['html', 'js', 'css'],
      },
    ],
  },
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]_[hash:base64:5]',
  },
};

module.exports = phase => {
  nextConfig.env = {
    API_URL: process.env.API_URL
      ? process.env.API_URL
      : 'https://golfsystem-api.herokuapp.com',
    PAYMAYA_API_URL: process.env.PAYMAYA_API_URL
      ? process.env.PAYMAYA_API_URL
      : 'https://pg-sandbox.paymaya.com',
    PAYMAYA_PUBLIC_KEY: process.env.PAYMAYA_PUBLIC_KEY
      ? process.env.PAYMAYA_PUBLIC_KEY
      : 'cGstTkNMazdKZURiWDFtMjJaUk1EWU85YkVQb3dOV1Q1SjRhTklLSWJjVHkyYQ',
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID
      ? process.env.FACEBOOK_APP_ID
      : '365276184099550',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
      ? process.env.GOOGLE_CLIENT_ID
      : '1036713656661-ecifvnq1kuturu55i7fuh51049bg8o40.apps.googleusercontent.com',
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return withBundleAnalyzer(withCSS(withESLint(nextConfig)));
  }

  if (phase === PHASE_PRODUCTION_BUILD) {
    return withBundleAnalyzer(withCSS(withPurgeCss(withESLint(nextConfig))));
  }

  return nextConfig;
};
