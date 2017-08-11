'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mainloop = require('mainloop.js');

var _mainloop2 = _interopRequireDefault(_mainloop);

var _engine = require('./engine');

var _engine2 = _interopRequireDefault(_engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(canvas) {
    _classCallCheck(this, Game);

    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.engine = new _engine2.default();
  }

  _createClass(Game, [{
    key: 'start',
    value: function start() {
      _mainloop2.default.setBegin(this.engine.begin).setUpdate(this.engine.update).setDraw(this.engine.draw).start();
    }
  }, {
    key: 'stop',
    value: function stop() {
      _mainloop2.default.stop();
    }
  }]);

  return Game;
}();

exports.default = Game;