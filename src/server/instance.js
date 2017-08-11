var io = null;
var sockets = {}

function initSocket(socket) {
	let id = socket.id;
	sockets[id] = socket;
    console.log('[INFO] Socket ' + id + ' connected!');

	socket.on('disconnect', () => {
        console.log('[INFO] Socket ' + id + ' disconnected!');
        socket.broadcast.emit('disconnect', id);
    });
}

function onConnection(socket) {
	initSocket(socket);
}

export default function (ioIstance) {
	io = ioIstance;
	io.on('connection', onConnection);
}
