import React from 'react';

const getErrorMessage = statusCode => {
  switch (statusCode) {
    case 401:
      return 'This page is forbidden.';
    case 404:
      return 'Page not found.';
    default:
      return 'An error occurred on client.';
  }
};

const Error = props => {
  const { statusCode } = props;
  return <p className="text-center">{getErrorMessage(statusCode)}</p>;
};

Error.getInitialProps = (res, err) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode };
};

export default Error;
