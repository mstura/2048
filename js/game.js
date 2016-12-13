(function() {
  'use strict';

  function matrix (size){
    this.size = size;
    this.cells = [];
    this.build();
  }

  matrix.prototype.build = function () {
    for (var x = 0; x < this.size; x++) {
      var row = this.cells[x] = [];

        for (var y = 0; y < this.size; y++) {
        row.push(null);
        }
      }
    };

    matrix.prototype.insert = function (position, callback, value) {
      this.cells[position.y][position.x] = value || 2;
      callback('insert',position, value);
    };

    matrix.prototype.remove = function (position, callback) {
      this.cells[position.y][position.x] = null;
      if (callback) {callback('remove', position)};
    };

    matrix.prototype.move = function (position, destination, callback) {
      let value = this.cells[position.y][position.x];
      if (this.cells[destination.y][destination.x] === null) {
        this.cells[destination.y][destination.x] = this.cells[position.y][position.x];
        this.remove(position);
        callback('move', position, value, destination);
        return true;
      }
      return false;
    };

    matrix.prototype.merge = function (position, destination, value, callback) {
      if (this.cells[destination.y][destination.x] === value) {
        this.cells[destination.y][destination.x] += value;
        this.remove(position);
        callback('merge', position, this.cells[destination.y][destination.x], destination);
        return true;
      }
    };

    matrix.prototype.travers = function (position, vector, callback) {
      let moved = false;
      if (this.cells[position.y][position.x] !== null) {
      let destination = {
        x: position.x + vector.x,
        y: position.y + vector.y
      };
        if (destination.x < 4 && destination.y < 4 && destination.x > -1 && destination.y > -1) {
        moved = this.move(position, destination, callback);
        if (!moved) {
          moved = this.merge(position, destination, this.cells[position.y][position.x], callback);
          } else if (moved) {
            this.travers(destination, vector, callback);
          }
        }
      }
      return moved;
    };

    matrix.prototype.voidPositions = function () {
      var available = [];
      for (var y = 0; y < this.size; y++) {
        for (var x = 0; x < this.size; x++) {
          if (this.cells[y][x] === null) {
            let position = {x: x, y:y}
            available.push(position);
          }
        }
      }
      return available;
    };

    matrix.prototype.traversals = function (vector) {
      var traversals = {
    x: [],
    y: []
  };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

  function app(){
    this.matrix = new matrix(4);
    this.handler = new handler();
    this.handler.listen('keydown',this.run.bind(this), window);
    this.map = this.acquire(4);
    this.moves = 0;
    this.handler.listen('DOMContentLoaded',this.newGame.bind(this), window);
    }

    app.prototype.newGame = function () {
      let startTiles = 2;
      for (var i = 0; i < startTiles; i++) {
        this.matrix.insert(this.randomPosition(),this.transform);
      }
    };
    app.prototype.acquire = function (size) {
      var map = [];
      for (var x = 0; x < size; x++) {
        var row = map[x] = [];

          for (var y = 0; y < size; y++) {
          var pos = '.position-'.concat(x+1,'-',y+1);
          var gridPosition = document.querySelector(pos)
          row.push(gridPosition);
          }
        }
        return map;
    };

    app.prototype.run = function (event) {
      this.moves = 0;
      this.handler.eventHandler(this.go, event);
      if (this.moves > 0) {
        this.matrix.insert(this.randomPosition(),this.transform)
      }
    };

    app.prototype.go = function go(vector){
        var traversals = game.matrix.traversals(vector);
        for (var x = 0; x < traversals.x.length; x++) {
        for (var y = 0; y < traversals.y.length; y++) {
          let position = {
            x: traversals.x[x],
            y: traversals.y[y]
          }
          let moved = game.matrix.travers(position, vector, game.transform);
          if (moved) {game.moves++;}
        }}
    };

    app.prototype.randomPosition = function () {
      var cells = this.matrix.voidPositions();

      if (cells.length) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    };

    app.prototype.transform = function (action, position, value, destination) {
      var parent = game.map[position.y][position.x];
      if (destination){var newParent = game.map[destination.y][destination.x]};
      switch (action) {
        case 'insert':
          game.handler.createElement(parent,'div',value);
          break;
        case 'move':
          game.handler.clearTile(parent);
          game.transform('insert', destination, value);
          break;
        case 'merge':
          game.handler.clearTile(parent);
          game.handler.clearTile(newParent);
          game.transform('insert',destination,value);
          break;
        case 'remove':
          game.handler.clearTile(parent);
          break;
      }
    };
var game = new app;
}());
