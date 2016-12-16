(function(window) {
  'use strict';

  function tile(position, value){
    this.position = position;
    this.newPosition = null;
    this.value = value || 2;
    this.merged = null;
    this.classes = ['position-'.concat(this.position.x,'-',this.position.y), 'tile-'.concat(this.value),'tile'];
    this.pointer = null;
    }

  tile.prototype.update = function (position, value, merged) {
    this.newPosition = position;
    if (value) {this.value = value;}
    if (merged) {this.merged = true;}
  };

  tile.prototype.prepare = function () {
    this.merged = null;
    this.position = this.newPosition;
    this.newPosition = null;
  };

  window = window || {};
  window.tile = tile;
}(window));
