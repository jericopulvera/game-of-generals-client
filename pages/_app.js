import '@styles/index.css';

import React from 'react';
// import React, { useEffect } from 'react'
import { Container } from 'next/app';
import NProgress from 'nprogress';
import Router from 'next/router';
import withReduxStore from '@lib/with-redux-store';
import { Provider } from 'react-redux';

Router.events.on('routeChangeStart', url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = props => {
  const { Component, pageProps, reduxStore } = props;

  return (
    <Container>
      <Provider store={reduxStore}>
        <Component {...pageProps} />
      </Provider>
    </Container>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default withReduxStore(MyApp);
