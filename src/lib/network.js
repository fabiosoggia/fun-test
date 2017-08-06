import SimplePeer from 'simple-peer'
import IO from 'socket.io-client'

export default class Network {
  connect () {
    let self = this
    this.socket = IO()
    this.socket.on('initiator', function (data) {
      self.socketId = data.socketId
      var initiator = data.initiator
      console.log('initiator', initiator)
      let peer = new SimplePeer({ initiator: initiator, trickle: true })
      peer.on('signal', function (signal) {
        let data = {
          socketId: self.socketId,
          signal: signal
        }
        console.log('peer-signal', data)
        self.socket.emit('signal-server', 'prova')
        if (initiator) {
          self.socket.emit('signal-server', data)
          return
        }
        self.socket.emit('signal-client', data)
      })
      peer.on('data', (data) => {
        console.log('data: ' + data)
      })
      peer.on('connect', function () {
        console.log('CONNECT')
        peer.send('whatever' + Math.random())
      })
      peer.on('error', (err) => {
        console.log('error', err)
      })
      self.peer = peer
    })
    this.socket.on('signal', function (signal) {
      console.log('socket-signal', signal)
      self.peer.signal(signal)
    })
  }
}
