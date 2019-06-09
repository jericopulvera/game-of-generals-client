// https://github.com/zeit/next.js/tree/master/examples/with-redux
import React from 'react';
import { initializeStore } from '@store';
import { fetchUser } from '@api/auth';
import { parseCookies, destroyCookie } from 'nookies';
import axios from 'axios';
// import bookingInitialState from '@store/initialState/booking';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(ctx, initialReduxState) {
  const { token } = parseCookies(ctx);

  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    if (!token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      return initializeStore(initialReduxState);
    }

    return fetchUser(token)
      .then(response => {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        return initializeStore({
          user: response.data.data,
        });
      })
      .catch(() => {
        destroyCookie(ctx, 'token');
        return initializeStore(initialReduxState);
      });
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    window[__NEXT_REDUX_STORE__] = initializeStore(initialReduxState);
  }
  return window[__NEXT_REDUX_STORE__];
}

export default App =>
  class AppWithRedux extends React.Component {
    static async getInitialProps(appContext) {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const { ctx } = appContext;
      const reduxStore = await getOrCreateStore(ctx, {});

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      };
    }

    constructor(props) {
      super(props);
      const { initialReduxState } = props;
      this.reduxStore = getOrCreateStore(null, initialReduxState);
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />;
    }
  };
