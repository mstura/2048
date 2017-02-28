(function() {
  'use strict';

  function app(){
    this.matrix = new matrix(4);
    this.handler = new handler();
    this.score = 0;
    this.moves = 0;
    this.state = null;
    this.timeWarp = false;
    this.handler.listen('keydown',this.run.bind(this), window);
    this.handler.listen('DOMContentLoaded',this.newGame.bind(this), window);
    this.handler.listen('transitionend', this.renderAfter.bind(this), this.handler.container);
    this.handler.listen('click', this.timeMachine.bind(this), this.handler.timeBTN);
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
      if (this.state === false) {
        this.clearBoard();
        this.handler.modCls('game-over',this.handler.loseState,'remove');
        this.score = 0;
        this.handler.scoreUpdate(this.score);
      }
      this.state = true;
      let startTiles = 2;
      for (var i = 0; i < startTiles; i++) {
        this.matrix.insert(this.randomPosition());
      }
      this.renderNewTiles();
      this.renderAfter();
    };

    app.prototype.gameOver = function () {
      this.handler.modCls('game-over',this.handler.loseState,'add');
      this.handler.listen('click', this.newGame.bind(this), this.handler.ngBTN);
    };

    app.prototype.run = function (event) {
      this.prepare();
      let vector = this.handler.eventHandler(event);
      if (vector) { this.go(vector); }
      if (this.moves > 0) {
        this.updateScore();
        this.renderMotion();
          this.matrix.insert(this.randomPosition());
          this.renderNewTiles();
          this.timeState(true);
          this.state = this.matrix.checkState();
          if (!this.state) {
            this.timeState(false);
            this.gameOver();
          }
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
              if (this.matrix.mergable(tile,testMerge)) {
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
      let self = this;

      activeTiles.forEach(function(tile){
        self.handler.modCls(null,tile.pointer,'clear');
        let cls = tile.classes[0].concat(' ',tile.classes[1],' ',tile.classes[2]);
        self.handler.modCls(cls,tile.pointer,'fill');
      });
    };

    app.prototype.clearBoard = function () {
      let self = this;
      let activeTiles = this.matrix.activeTiles();

      activeTiles.forEach(function(obj) {
        let pointer = obj.pointer;
        let pos = obj.newPosition || obj.position;
        self.handler.clearTile(pointer);
        self.matrix.remove(pos);
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

  app.prototype.timeMachine = function () {
    if (this.timeWarp === true) {
    let self = this;
    let activeTiles = this.matrix.activeTiles();
    this.matrix.clear();
    activeTiles.forEach(function(tile){
      let position = tile.position;
      let mergedTile = tile.mergedfrom;
      if (position) {
        self.matrix.cells[position.y][position.x] = tile;
        tile.update(position);
      }
      if (mergedTile) {
        let newScore = tile.value;
        tile.update(null,mergedTile.value);
        self.matrix.cells[mergedTile.position.y][mergedTile.position.x] = mergedTile;
        mergedTile.update(mergedTile.position);
        mergedTile.pointer = null;
        tile.mergedfrom = null;
        self.score -= newScore;
      }
    });
    this.handler.scoreUpdate(this.score);
    this.clearResidue();
    this.renderNewTiles();
    this.renderBoard();
    this.timeState(false);
  }
};

  app.prototype.timeState = function (value) {
    this.timeWarp = value;
    if (value) {
      this.handler.modCls('unavailable', this.handler.timeBTN.parentNode, 'remove');
    } else {
      this.handler.modCls('unavailable', this.handler.timeBTN.parentNode, 'add');
    }
  };

    var game = new app;
}());
