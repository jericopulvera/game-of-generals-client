const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/matches', (req, res) => {
      const actualPage = '/matches/index';
      const queryParams = {};
      app.render(req, res, actualPage, queryParams);
    });

    server.get('/matches/create', (req, res) => {
      const actualPage = '/matches/create';
      const queryParams = {};
      app.render(req, res, actualPage, queryParams);
    });

    server.get('/matches/:matchId', (req, res) => {
      const actualPage = '/matches/_matchId';
      const queryParams = { matchId: req.params.matchId };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
