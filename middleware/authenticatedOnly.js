import Router from 'next/router';

const isServer = typeof window === 'undefined';

export default function({ reduxStore, res }) {
  const state = reduxStore.getState();

  if (state.user) return;

  if (isServer) {
    res.writeHead(302, { Location: '/' });
    res.end();
  } else {
    Router.push('/');
  }
}
