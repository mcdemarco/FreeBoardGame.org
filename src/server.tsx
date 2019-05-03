import React from 'react';
import Router from 'koa-router';
import KoaStatic from 'koa-static';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';
import { StaticRouter } from 'react-router-dom';
import { GAMES_LIST } from './games';
import { getPageMetadata, IPageMetadata } from './metadata';
import noCache from 'koa-no-cache';

const { Server } = require('@freeboardgame.org/boardgame.io/server'); // tslint:disable-line
import App from './App/App';

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV;
const PROD = NODE_ENV === 'production';

const RESTRICTIVE_ROBOTS_TXT = ['User-agent: *',
  'Disallow: /', ''].join('\n');

const template = fs.readFileSync('./dist/layout.html', 'utf8');

function renderHtml(layout: string, metadata: IPageMetadata, reactHtml: string) {
  let result = layout;

  result = result.replace('<title>FreeBoardGame.org</title>', `<title>${metadata.title}</title>`);

  if (metadata.description) {
    result = result.replace(
      '<meta name="description" content="">\n',
      `<meta name="description" content="${metadata.description}">\n`);
  } else {
    result = result.replace(
      '<meta name="description" content="">\n',
      '');
  }

  if (!metadata.noindex) {
    result = result.replace('<meta name="robots" content="noindex">\n',
      '');
  }

  result = result.replace(
    '<div id="root"></div>',
    `<div id="root">${reactHtml}</div>`);
  return result;
}

const renderSite = async (url: string) => {
  const asyncContext = createAsyncContext();
  const metadata = getPageMetadata(url);
  const context = {};
  const app = (
    <AsyncComponentProvider asyncContext={asyncContext}>
      <StaticRouter
        location={url}
        context={context}
      >
        <App />
      </StaticRouter>
    </AsyncComponentProvider>
  );
  await asyncBootstrapper(app);
  const reactHtml = ReactDOMServer.renderToStaticMarkup(app);
  return ({
    status: (context as any).status,
    render: renderHtml(template, metadata, reactHtml),
  });
};

const startServer = async () => {
  const configs = Promise.all(GAMES_LIST.map((gameDef) => gameDef.config()));
  const games = (await configs).map((config) => config.default.bgioGame);
  const server = Server({ games });
  server.app.use(noCache({ global: true }));
  server.app.use(KoaStatic('./static'));
  server.app.use(KoaStatic('./dist'));
  const router = new Router();
  server.app.use(router.routes());
  server.app.use(router.allowedMethods());
  server.app.use(async (ctx: any, next: any) => {
    if (ctx.request.path === '/robots.txt') {
      if (ctx.request.hostname.toLowerCase() !== 'freeboardgame.org') {
        ctx.response.body = RESTRICTIVE_ROBOTS_TXT;
      }
    } else {
      await next();
    }
  });
  server.app.use(async (ctx: any, next: any) => {
    await next();
    const { render, status } = await renderSite(ctx.request.url);
    if (status) {
      ctx.response.status = Number(status);
    }
    ctx.response.body = render;
  });

  server.app.listen(PORT, HOST, () => {
    console.log(`Serving ${NODE_ENV} at: http://${HOST}:${PORT}/`); // tslint:disable-line
  });
};

startServer();
