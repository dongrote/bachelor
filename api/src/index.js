#!/usr/bin/env node
'use strict';
require('dotenv').config();

/**
 * Module dependencies.
 */

const env = require('./env'),
  app = require('./app'),
  core = require('./core'),
  log = require('debug-logger')('api:server'),
  io = core.websocket,
  http = require('http');

/**
 * Get port from environment and store in Express.
 */


app.set('port', env.listenPort());

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
io.attach(server);
io.on('connect', client => {
  core.system.websocketClientConnect(client);
  client.on('disconnect', () => core.system.websocketClientDisconnect(client));
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(env.listenPort());
server.on('error', err => {
  log.error(err);
  process.exit(1);
});
server.on('listening', () => log.info(`listening on port ${env.listenPort()}`));
