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
    };

    matrix.prototype.remove = function (position) {
      this.cells[position.y][position.x] = null;
    };

    matrix.prototype.move = function (position, destination) {
      if (this.cells[position.y][position.x]) {
      if (this.cells[destination.y][destination.x] === null) {
        this.cells[destination.y][destination.x] = this.cells[position.y][position.x];
        this.cells[destination.y][destination.x].update(destination);
        this.cells[position.y][position.x] = null;
      }
    }
    };

    matrix.prototype.merge = function (staticObject, object) {
      if (staticObject.value === object.value) {
        let value = staticObject.value *2;
        staticObject.update(null,value,object);
        this.remove(object.position);
      }
    };

    matrix.prototype.travers = function (position, vector) {
      //if (this.cells[position.y][position.x] !== null) {
      let destination = {
        x: position.x + vector.x,
        y: position.y + vector.y
        };
        if (destination.x < 4 && destination.y < 4 && destination.x > -1 && destination.y > -1) {
          if (this.cells[destination.y][destination.x]) {
            return position;
          }else {
            return this.travers(destination,vector);
          }
        } else {
          return position;
        }
      //}
    };

    matrix.prototype.mergable = function (origin, destination, testingState) {
      if (!testingState) {
        if (origin.value === this.cells[destination.y][destination.x].value && !origin.mergedfrom && !this.cells[destination.y][destination.x].mergedfrom) {
          return true;
        } else {
          return false;
        }
      } else if (testingState) {
        if (this.cells[destination.y][destination.x] === null || origin.value === this.cells[destination.y][destination.x].value) {
          return true;
        } else {
          return false;
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

matrix.prototype.checkState = function () {
let vectors = [{x:1,y:0},{x:0,y:1}];
let activeTiles = this.activeTiles();
if (activeTiles.length === 16) {
for (var y = 0; y < this.size; y++) {
  for (var x = 0; x < this.size; x++) {
    for (var i = 0; i < vectors.length; i++) {
      let tile = this.cells[y][x];
      if (tile) {
      let pos = tile.newPosition || tile.position;
      let testdest = {x: pos.x + vectors[i].x,
                      y: pos.y + vectors[i].y};
        if (testdest.x < 4 && testdest.y < 4 && testdest.x > -1 && testdest.y > -1) {
          if (this.mergable(tile, testdest, true)) {
            return true;
            }
          }
        }
      }
    }
  }
    return false;
  } else {
    return true;
  }
};

matrix.prototype.clear = function () {
  for (var y = 0; y < this.size; y++) {
    for (var x = 0; x < this.size; x++) {
      let position = {
        x: x,
        y: y
      }
      this.remove(position);
    }
  }
};

  window = window || {};
  window.matrix = matrix;
}(window));
