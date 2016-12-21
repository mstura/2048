(function(window) {
  'use strict';

  function tile(position, value){
    this.position = null;
    this.newPosition = position;
    this.value = value || 2;
    this.mergedfrom = null;
    this.classes = ['position-'.concat(this.newPosition.x,'-',this.newPosition.y), 'tile-','tile'];
    this.pointer = null;
    }

  tile.prototype.update = function (position, value, mergedfrom) {
    if (position) {
      this.newPosition = position;
    }
    if (value) {
      this.value = value;
    }
    if (mergedfrom) {this.mergedfrom = mergedfrom;}
  };

  tile.prototype.prepare = function () {
    this.mergedfrom = null;
    if (this.newPosition) {
      this.classes[1] = 'tile-'.concat(this.value);
      this.classes[0] = 'position-'.concat(this.newPosition.x,'-',this.newPosition.y);
      this.position = this.newPosition;
      this.newPosition = null;
    }
  };

  window = window || {};
  window.tile = tile;
}(window));
