(function() {
  'use strict';

  function app(){
    this.matrix = new matrix(4);
    this.handler = new handler();
    this.score = 0;
    this.moves = 0;
    this.state = true;
    this.handler.listen('keydown',this.run.bind(this), window);
    this.handler.listen('DOMContentLoaded',this.newGame.bind(this), window);
    this.handler.listen('transitionend', this.renderAfter.bind(this), this.handler.container);
    }

    app.prototype.updateScore = function () {
      let activeTiles = this.matrix.activeTiles();
      let score = 0;
      activeTiles.forEach(function(object){
        if (object.mergedfrom) {
          score += object.value;
        }
      });
      this.score += score;
      this.handler.scoreUpdate(this.score);
    };

    app.prototype.newGame = function () {
      let startTiles = 2;
      for (var i = 0; i < startTiles; i++) {
        this.matrix.insert(this.randomPosition());
      }
      this.renderNewTiles();
      this.renderAfter();
    };

    app.prototype.run = function (event) {
      this.prepare();
      let vector = this.handler.eventHandler(event);
      this.go(vector);
      if (this.moves > 0) {
        this.updateScore();
        this.renderMotion();
          this.matrix.insert(this.randomPosition());
          this.renderNewTiles();
        }
    };

    app.prototype.go = function (vector){
        var traversals = this.matrix.traversals(vector);
        for (var x = 0; x < traversals.x.length; x++) {
        for (var y = 0; y < traversals.y.length; y++) {
          let position = {
            x: traversals.x[x],
            y: traversals.y[y]
          }
          let tile = this.matrix.cells[position.y][position.x];
          if (tile) {
            let destination = this.matrix.travers(position, vector);
            let testMerge = {
              x: destination.x + vector.x,
              y: destination.y + vector.y
            }
            if (testMerge.x < 4 && testMerge.y < 4 && testMerge.x > -1 && testMerge.y > -1) {
              let merge = this.matrix.mergable(tile,testMerge);
              if (merge) {
                let object = this.matrix.cells[testMerge.y][testMerge.x];
                this.matrix.merge(object, tile);
                this.moves++;
              }
            }
            if (destination !== position) {
              this.matrix.move(position, destination);
              this.moves++;
            }
          }
        }}
    };

    app.prototype.randomPosition = function () {
      var cells = this.matrix.voidPositions();

      if (cells.length) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    };

    app.prototype.renderMotion = function () {
      let activeTiles = this.matrix.activeTiles();
      for (var i = 0; i < activeTiles.length; i++) {
        if (activeTiles[i].newPosition) {
          this.handler.renderPosition(activeTiles[i]);
        }
        if (activeTiles[i].mergedfrom) {
          let f = activeTiles[i].mergedfrom;
          this.handler.renderPosition(f, activeTiles[i].newPosition || activeTiles[i].position);
        }
      }
    };

    app.prototype.renderNewTiles = function () {
      let activeTiles = this.matrix.activeTiles();
      for (var i = 0; i < activeTiles.length; i++) {
        if (!activeTiles[i].pointer) {
          activeTiles[i].pointer = this.handler.createElement('div');
          this.handler.renderPosition(activeTiles[i]);
        }
      }
    };
    app.prototype.prepare = function () {
      let activeTiles = this.matrix.activeTiles();
      activeTiles.forEach(function (tile){
        tile.prepare();
      });
      if (this.moves !== 0) {
        this.clearResidue();
        this.renderBoard();
        this.moves = 0;
      }
    };

    app.prototype.renderBoard = function () {
      let activeTiles = this.matrix.activeTiles();
      activeTiles.forEach(function(tile){
        tile.pointer.className = "";
          tile.pointer.className = tile.classes[0].concat(' ',tile.classes[1],' ',tile.classes[2]);
      });
    };

    app.prototype.clearResidue = function () {
      let elements = document.querySelectorAll('.tile');
      let activeTiles = this.matrix.activeTiles();
      let residue = [];
      let self = this;
      for (var i = 0; i < elements.length; i++) {
        residue.push(elements[i]);
      }

      let realResidue = residue.filter(function (item){
        for (var i = 0; i < activeTiles.length; i++) {
        if (item === activeTiles[i].pointer) {
          return null;
          }
        }
        return item;
      });

      realResidue.forEach(function (obj){
        if (obj) {
          self.handler.clearTile(obj);
        }
      });
    };

    app.prototype.renderAfter = function () {
      let self = this;
      let activeTiles = this.matrix.activeTiles();
      activeTiles.forEach(function (tile) {
        self.handler.renderTile(tile);
      });
      this.clearResidue();
      this.moves = 0;
  };
    var game = new app;
}());
