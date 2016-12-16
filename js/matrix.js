(function(window) {
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
          let position = {x:y, y:x};
        row.push(null);
        }
      }
    };

    matrix.prototype.insert = function (position, value) {
      this.cells[position.y][position.x] = new tile(position);
      return this.cells[position.y][position.x].classes[0];
    };

    matrix.prototype.remove = function (position, callback) {
      this.cells[position.y][position.x] = null;
      if (callback) {callback('remove', position)};
    };

    matrix.prototype.move = function (position, destination, callback) {
      if (this.cells[destination.y][destination.x] === null) {
        let value = this.cells[position.y][position.x];
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
      if (this.cells[position.y][position.x] !== null) {
      let destination = {
        x: position.x + vector.x,
        y: position.y + vector.y
      };
        if (destination.x < 4 && destination.y < 4 && destination.x > -1 && destination.y > -1) {
         let moved = this.move(position, destination, callback);
        if (!moved) {
          moved = this.merge(position, destination, this.cells[position.y][position.x], callback);
          } else if (moved) {
            this.travers(destination, vector, callback);
          }
          return moved;
        }
      }
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

matrix.prototype.activeTiles = function () {
let activeValues = [];
for (var i = 0; i < this.size; i++) {
  activeValues = activeValues.concat(this.cells[i]);
}
    let activeTiles = activeValues.filter(function(object){
      if (object !== null) {
        return object;
      }
    });
  return activeTiles;
};

  window = window || {};
  window.matrix = matrix;
}(window));
