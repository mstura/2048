//(function() {
  'use strict';

  function matrix (size){
    this.size = size;
    this.cells = [];
    this.map = [];
    this.build();
    this.acquire();
  }

matrix.prototype.acquire = function () {
  for (var x = 0; x < this.size; x++) {
    var row = this.map[x] = [];

      for (var y = 0; y < this.size; y++) {
      var position = '.position-'.concat(x+1,'-',y+1);
      var gridPosition = document.querySelector(position)
      row.push(gridPosition);
      }
    }
};

  matrix.prototype.build = function () {
    for (var x = 0; x < this.size; x++) {
      var row = this.cells[x] = [];

        for (var y = 0; y < this.size; y++) {
        row.push(null);
        }
      }
    };

    matrix.prototype.insert = function (position, value) {
      this.cells[position.y][position.x] = value || 2;
      this.transform(this.map[position.y][position.x], value);
    };

    matrix.prototype.transform = function (parent, value, newParent) {
      if (!parent.firstChild) {
        game.handler.createElement(parent,'div',value);
      } else if (newParent) {
        game.handler.clearTile(parent);
        this.transform(newParent, value);
      } else {
        game.handler.clearTile(parent);
        this.transform(parent,value);
      }
    };

    matrix.prototype.move = function (position, destination) {
      let value = this.cells[position.y][position.x];
      let merged = false;
      if (this.cells[destination.y][destination.x] === null) {
        this.cells[destination.y][destination.x] = this.cells[position.y][position.x];
        this.cells[position.y][position.x] = null;
        this.transform(this.map[position.y][position.x], value, this.map[destination.y][destination.x])
      } else {
          merged = this.merge(position,destination,value);
      }
      return merged;
    };
    matrix.prototype.merge = function (position, destination, value) {
      if (this.cells[destination.y][destination.x] === value) {
        this.cells[destination.y][destination.x] += value;
        this.cells[position.y][position.x] = null;
        game.handler.clearTile(this.map[position.y][position.x]);
        this.transform(this.map[destination.y][destination.x], this.cells[destination.y][destination.x]);
        return true;
      }
    };

    matrix.prototype.travers = function (position, vector) {
      if (this.cells[position.y][position.x] !== null) {
      let destination = {
        x: position.x + vector.x,
        y: position.y + vector.y
      };
        if (destination.x < 4 && destination.y < 4 && destination.x > -1 && destination.y > -1) {
        let moved = this.move(position, destination);
        if (!moved) {
          this.travers(destination, vector);
          }
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

  matrix.prototype.go = function go(vector){
      var traversals = game.matrix.traversals(vector);
      for (var x = 0; x < traversals.x.length; x++) {
      for (var y = 0; y < traversals.y.length; y++) {
        let position = {
          x: traversals.x[x],
          y: traversals.y[y]
        }
        game.matrix.travers(position, vector);
      }}
  };

  matrix.prototype.currentState = function () {
    var cells = [];
    for (var x = 0; x < this.size; x++) {
      var row = cells[x] = [];

        for (var y = 0; y < this.size; y++) {
        row.push(this.cells[x][y]);
        }
      }
      return cells;
  };

  function app(){
    this.matrix = new matrix(4);
    this.handler = new handler();
    this.handler.listen('keydown',this.run.bind(this), window);
    this.currentState = [];
    }

    app.prototype.run = function (event) {
      this.currentState = this.matrix.currentState();
      this.handler.eventHandler(this.matrix.go, event);
      this.stateChanged(this.matrix.cells);

    };
    app.prototype.randomPosition = function () {
      var cells = this.matrix.voidPositions();

      if (cells.length) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    };
    app.prototype.stateChanged = function (matrix) {
      if (this.currentState !== matrix) {
        let position = this.randomPosition();

        this.matrix.insert(position);
      }
    };
var game = new app;
//}());
