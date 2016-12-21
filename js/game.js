//(function() {
  'use strict';

  function app(){
    this.matrix = new matrix(4);
    this.handler = new handler();
    this.moves = 0;
    this.residue = [];
    this.handler.listen('keydown',this.run.bind(this), window);
    this.handler.listen('DOMContentLoaded',this.newGame.bind(this), window);
    this.handler.listen('transitionend', this.renderAfter.bind(this), this.handler.container);
    }

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
      this.renderMotion();
      if (this.moves > 0) {
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
          this.residue.push(f.pointer);
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
      this.moves = 0;
      let activeTiles = this.matrix.activeTiles();
      for (var i = 0; i < activeTiles.length; i++) {
        activeTiles[i].prepare();
      }
      for (var i = 0; i < this.residue.length; i++) {
        if (this.residue[i].parentNode) {
          this.handler.clearTile(this.residue[i]);
        }
      }
      this.residue = [];
    };

    app.prototype.renderAfter = function () {
      let activeTiles = this.matrix.activeTiles();
      for (var i = 0; i < activeTiles.length; i++) {
        if (activeTiles[i].mergedfrom) {
          let f = activeTiles[i].mergedfrom;
          if (f.pointer.parentNode) {
            this.handler.clearTile(f.pointer);
          }
        }
        this.handler.renderTile(activeTiles[i]);
      }
  };
    var game = new app;
//}());
