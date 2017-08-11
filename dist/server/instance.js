'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (ioIstance) {
	io = ioIstance;
	io.on('connection', onConnection);
};

var io = null;
var sockets = {};

function initSocket(socket) {
	var id = socket.id;
	sockets[id] = socket;
	console.log('[INFO] Socket ' + id + ' connected!');

	socket.on('disconnect', function () {
		console.log('[INFO] Socket ' + id + ' disconnected!');
		socket.broadcast.emit('disconnect', id);
	});
}

function onConnection(socket) {
	initSocket(socket);
}