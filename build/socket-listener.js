var connections = {}
var connectionsCount = 0
var signalServer = null
var serverId = null

module.exports = function (io) {
  io.on('connection', function (socket) {
    var socketId = socket.id
    connections[socketId] = socket
    connectionsCount = connectionsCount + 1
    console.log('a user connected')
    console.log(connectionsCount, 'users connected')
    socket.on('disconnect', function (reason) {
      connectionsCount = connectionsCount - 1
    })
    onConnection(socket)
  })
  io.on('signal-server', function (data) {
    console.log('signal-server', data)
    signalServer = data.signal
  })
  io.on('signal-client', function (data) {
    var socketId = data.socketId
    var socket = connections[socketId]
    console.log('signal-cliet', data)
    connections[serverId].emit('signal', data)
    socket.emit('signal', signalServer)
  })
}

function onConnection (socket) {
  var initiator = (connectionsCount === 1)
  if (initiator) {
    serverId = socket.id
  }
  var data = {
    initiator: initiator,
    socketId: socket.id
  }
  socket.emit('initiator', data)
  if (!initiator) {
    socket.emit('signal', signalServer)
  }
}
