//(function() {
  'use strict';

  function app(){
    this.matrix = new matrix(4);
    this.handler = new handler();
    this.map = this.acquire(4);
    this.moves = 0;
    this.handler.listen('keydown',this.run.bind(this), window);
    //this.handler.listen('DOMContentLoaded',this.newGame.bind(this), window);
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
        //this.matrix.insert(this.randomPosition(),this.transform);
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

    app.prototype.render = function () {
      let activeTiles = this.matrix.activeTiles();
      for (var i = 0; i < activeTiles.length; i++) {
        let position = {x: activeTiles[i].x, y:activeTiles[i].y};
        this.handler.updateClasses(activeTiles[i].pointer,activeTiles[i].classes);
      }
    };

    var game = new app;
//}());
