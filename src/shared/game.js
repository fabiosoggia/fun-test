import MainLoop from 'mainloop.js'
import Engine from './engine'

class Game {
  constructor (canvas) {
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
    this.engine = new Engine()
  }
  start () {
    MainLoop
      .setBegin(this.engine.begin)
      .setUpdate(this.engine.update)
      .setDraw(this.engine.draw)
      .start()
  }
  stop () {
    MainLoop.stop()
  }
}

export default Game
