<template>
  <canvas id="gamearea"></canvas>
</template>

<script>
import Game from '../lib/game'
import Network from '../lib/network'

let peer = new Network()
peer.connect()

export default {
  name: 'hello',
  mounted () {
    this.$el.width = 800
    this.$el.height = 600
    this.game = new Game(this.$el)
    this.game.start()
  },
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
