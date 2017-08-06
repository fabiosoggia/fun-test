var Entity = function Entity() {
    this.x = 0
    this.y = 0
    this.width = 1
    this.height = 1
    this.color = "#000"
}

Entity.prototype.top = function top() {
    var top = this.y - (this.height / 2)
    return top
}

Entity.prototype.left = function left() {
    var left = this.x - (this.width / 2)
    return left
}

Entity.prototype.right = function right() {
    var right = this.left() + this.width
    return right
}

Entity.prototype.bottom = function bottom() {
    var bottom = this.top() + this.height
    return bottom
}

Entity.prototype.draw = function draw(context) {
    var left = this.left()
    var top = this.top()
    context.fillStyle = this.color
    context.fillRect(left, top, this.width, this.height)
}

Entity.prototype.collide = function collide(entity) {
    var mw = Math.max(this.width, entity.width)
    if (this.distance(entity) < (mw / 2)) {
        return true
    }
    return false
    var mh = Math.max(this.height, entity.height)
    var dx = Math.abs(this.x - entity.x)
    var dy = Math.abs(this.y - entity.y)
    if ((dx <= mw) && (dy <= mh)) {
        return true
    }
    return false
}

Entity.prototype.distance = function distance(entity) {
    var a = Math.abs(this.x - entity.x)
    var b = Math.abs(this.y - entity.y)
    var d = Math.sqrt((a*a) + (b*b))
    return d
}

Entity.prototype.moveTo = function distance(x, y, max) {
    max = max || 0
    if (max == 0) {
        this.x = x
        this.y = y
        return
    }
    var a = Math.abs(this.x - x)
    var b = Math.abs(this.y - y)
    var d = Math.sqrt((a*a) + (b*b))
    if (d < max) {
        this.x = x
        this.y = y
        return
    }

    var c = (x - this.x)
    var b = (y - this.y)
    var beta = Math.atan2(b, c)
    var dx = Math.cos(beta) * max
    var dy = Math.sin(beta) * max
    this.x += dx
    this.y += dy
}

var Bullet = function Bullet(fromX, fromY, toX, toY, speed) {
    Entity.call(this)
    this.damage = 10
    this.time = new Date()
    this.fromX = fromX
    this.fromY = fromY
    this.x = fromX
    this.y = fromY
    this.toX = toX
    this.toY = toY
    this.speed = speed

    var c = (toX - fromX)
    var b = (toY - fromY)
    var beta = Math.atan2(b, c)
    var speedX = Math.cos(beta) * this.speed
    var speedY = Math.sin(beta) * this.speed

    this.speedX = speedX
    this.speedY = speedY
}
Bullet.prototype = Object.create(Entity.prototype)
Bullet.prototype.constructor = Bullet
Bullet.prototype.update = function update(delta) {
    this.x += this.speedX * delta
    this.y += this.speedY * delta
}
Bullet.prototype.getCurrentDamage = function getCurrentDamage() {
    return this.damage
}
Bullet.prototype.isExpired = function isExpired() {
    var a = Math.abs(this.x - this.fromX)
    var b = Math.abs(this.y - this.fromY)
    var d = Math.sqrt((a*a) + (b*b))
    return (d > 10000)
}

var Soldier = function Soldier() {
    Entity.call(this)
    this.bullets = []
    this.weapon = null
}
Soldier.prototype = Object.create(Entity.prototype)
Soldier.prototype.constructor = Soldier
Soldier.prototype.canFire = function () {
    if (this.weapon === null) {
        return false
    }
    return this.weapon.canFire()
}
Soldier.prototype.fire = function (toX, toY) {
    var bullets = this.weapon.fire(this.x, this.y, toX, toY)
    this.bullets = this.bullets.concat(bullets)
}



var Weapon = function Weapon() {
    this.fireRate = 5
    this.speed = 1
    this.bullets = []
    this.lastShotTime = 0
}
Weapon.prototype.fire = function (fromX, fromY, toX, toY) {
    this.lastShotTime = new Date()
    var bullet1 = new Bullet(fromX, fromY, toX, toY, this.speed)
    bullet1.width = 3
    bullet1.height = 3
    return [ bullet1 ]
}
Weapon.prototype.canFire = function () {
    var interval = 1000 / this.fireRate
    var lastBulletTime = this.lastShotTime
    var currentTime = new Date()
    var diff = currentTime - lastBulletTime
    if (diff >= interval) {
        return true
    }
    return false
}


var EnemyWeapon = function EnemyWeapon() {
    Weapon.call(this)
    this.fireRate = 4
    this.speed = .15
}
EnemyWeapon.prototype = Object.create(Weapon.prototype)
EnemyWeapon.prototype.constructor = EnemyWeapon
EnemyWeapon.prototype.fire = function (fromX, fromY, toX, toY) {
    this.lastShotTime = new Date()
    var bullet1 = new Bullet(fromX, fromY, toX, toY, this.speed)
    bullet1.width = 6
    bullet1.height = 6
    return [ bullet1 ]
}

var RoundWeapon = function RoundWeapon() {
    Weapon.call(this)
    this.fireRate = 2
    this.speed = .15
}
RoundWeapon.prototype = Object.create(Weapon.prototype)
RoundWeapon.prototype.constructor = RoundWeapon
RoundWeapon.prototype.fire = function (fromX, fromY, toX, toY) {
    this.lastShotTime = new Date()
    var n = Math.round(10 * Math.random())
    var diff = (Math.PI * 2) / n
    var beta = Math.atan2(toY - fromY, toX - fromX)
    var bullets = []
    for (var i = 0 i < n i++) {
        var angle = (i * diff) + beta
        var x = fromX + (Math.cos(angle))
        var y = fromY + (Math.sin(angle))
        var bullet = new Bullet(fromX, fromY, x, y, this.speed)
        bullet.width = 3
        bullet.height = 3
        bullets.push(bullet)
    }
    return bullets
}


var map = {
    player: new Soldier(),
    enemies: []
}



// (function () {

//     var settings = {
//         width: 800,
//         height: 600,
//     }

//     var Game = {
//         canvas: document.createElement("canvas"),
//         start: function() {
//             this.canvas.width = settings.width
//             this.canvas.height = settings.height
//             this.context = this.canvas.getContext("2d")
//             MainLoop
//                 .setBegin(begin)
//                 .setUpdate(update)
//                 .setDraw(draw)
//                 .start()
//         },
//         stop: function() {
//             MainLoop.stop()
//             this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
//         }
//     }

//     var player = new Soldier()
//     player.width = 32
//     player.height = 32
//     player.fireRate = 2
//     player.x = Math.round(this.canvas.width / 2)
//     player.y = Math.round(this.canvas.height / 2)

// })()

var Game = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800
        this.canvas.height = 600
        this.context = this.canvas.getContext("2d")

        map.player.color = "#900"
        map.player.width = 32
        map.player.height = 32
        map.player.weapon = new RoundWeapon()
        map.player.x = Math.round(this.canvas.width / 2)
        map.player.y = Math.round(this.canvas.height / 2)

        generateRandomEnemies()

        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        MainLoop
            .setBegin(begin)
            .setUpdate(update)
            .setDraw(draw)
            .start()
    },
    stop: function () {
        MainLoop.stop()
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

function generateRandomEnemies() {
    var n = 30
    for (var i = 0 i < n i++) {
        var enemy = new Soldier()
        enemy.x = Math.round(Math.random() * Game.canvas.width)
        enemy.y = Math.round(Math.random() * Game.canvas.height)
        enemy.width = 16
        enemy.height = 16
        enemy.weapon = new EnemyWeapon()
        map.enemies.push(enemy)
    }
}

function begin() {
    if (controllers.mouse.down) {
        if (map.player.canFire()) {
            var toX = controllers.mouse.x
            var toY = controllers.mouse.y
            map.player.fire(toX, toY)
        }
    }
    if (controllers.mouse.down3) {
        var toX = controllers.mouse.x
        var toY = controllers.mouse.y
        map.player.moveTo(toX, toY, 15)
    }
}


var controllers = {
    mouse: {
        x: 0,
        y: 0,
        down: false,
        down3: false,
    },
    keyboard: {
        a: false,
        w: false,
        d: false,
        s: false
    }
}

Game.canvas.onmousedown = function(e) {
    controllers.mouse.x = e.offsetX
    controllers.mouse.y = e.offsetY
    if (e.which === 1) {
        controllers.mouse.down = true
    }
    if (e.which === 3) {
        controllers.mouse.down3 = true
    }
    return false
}
document.body.onmouseup = function(e) {
    controllers.mouse.x = e.offsetX
    controllers.mouse.y = e.offsetY
    controllers.mouse.down = false
    controllers.mouse.down3 = false
}
Game.canvas.onmousemove = function(e) {
    controllers.mouse.x = e.offsetX
    controllers.mouse.y = e.offsetY
}
Game.canvas.oncontextmenu = function(e) {
    return false
}
document.body.onkeydown = function(e) {
    var code = e.which || e.keyCode
    if (code == 65) {
        controllers.keyboard.a = true
    }
    if (code == 87) {
        controllers.keyboard.w = true
    }
    if (code == 68) {
        controllers.keyboard.d = true
    }
    if (code == 83) {
        controllers.keyboard.s = true
    }
}
document.body.onkeyup = function(e) {
    var code = e.which || e.keyCode
    if (code == 65) {
        controllers.keyboard.a = false
    }
    if (code == 87) {
        controllers.keyboard.w = false
    }
    if (code == 68) {
        controllers.keyboard.d = false
    }
    if (code == 83) {
        controllers.keyboard.s = false
    }
}

function update(delta) {

    // Proiettili giocatore
    for (var i = 0 i < map.player.bullets.length i++) {
        var bullet = map.player.bullets[i]
        bullet.update(delta)

        if (bullet.isExpired()) {
            map.player.bullets.splice(i, 1)
            i--
        }

        for (var j = 0 j < map.enemies.length j++) {
            var enemy = map.enemies[j]
            if (bullet.collide(enemy)) {
                map.enemies.splice(j, 1)
                j--
                map.player.width = Math.min(70, map.player.width + 1)
                map.player.height = Math.min(70, map.player.height + 1)
            }
        }
    }

    // Proiettili nemici
    for (var j = 0 j < map.enemies.length j++) {
        var enemy = map.enemies[j]
        var dist = Math.min(200, enemy.distance(map.player))
        var probDist = (1 - (dist / 200))
        var odd = Math.random()
        if ((probDist + odd) >= 1) {
            if (enemy.canFire()) {
                var noiseX = (Math.random() * 20) - 10
                var noiseY = (Math.random() * 20) - 10
                enemy.fire(map.player.x + noiseX, map.player.y + noiseY, 5)
            }
        }

        for (var i = 0 i < enemy.bullets.length i++) {
            var bullet = enemy.bullets[i]
            bullet.update(delta)
            if (bullet.collide(map.player)) {
                enemy.bullets.splice(i, 1)
                i--
                map.player.width = Math.max(1, map.player.width - 5)
                map.player.height = Math.max(1, map.player.height - 5)
            }
        }
    }

    var playerSpeed = .15
    if (controllers.keyboard.a) {
        map.player.x -= playerSpeed * delta
    }
    if (controllers.keyboard.d) {
        map.player.x += playerSpeed * delta
    }
    if (controllers.keyboard.w) {
        map.player.y -= playerSpeed * delta
    }
    if (controllers.keyboard.s) {
        map.player.y += playerSpeed * delta
    }

    if (map.enemies.length < 5) {
        generateRandomEnemies()
    }

}

function draw() {
    Game.clear()
    var context = Game.context

    // Disegna il giocatore
    map.player.draw(context)
    for (var i = map.player.bullets.length - 1 i >= 0 i--) {
        map.player.bullets[i].draw(context)
    }

    for (var i = map.enemies.length - 1 i >= 0 i--) {
        var enemy = map.enemies[i]
        enemy.draw(context)
        for (var j = enemy.bullets.length - 1 j >= 0 j--) {
            enemy.bullets[j].draw(context)
        }
    }
}


Game.start()
