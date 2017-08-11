'use strict';

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import compression from 'compression';
import {validNick, findIndex, sanitizeString} from '../shared/util';
import {isServer} from '../shared/util';
import instance from './instance';

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
let port = process.env.PORT || 3000;
let users = [];
let sockets = {};

app.use(compression({}));
app.use(express['static'](__dirname + '/../client'));

instance(io);

server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});
