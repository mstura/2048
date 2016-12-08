(function(window) {
  'use strict';
  function handler(){
    this.classes = ['tile', 'tile-'];
    this.map = {
      37: {x:-1,y:0},
      38: {x:0,y:-1},
      39: {x:1,y:0},
      40: {x:0,y:1}
    }
  }

  handler.prototype.createElement = function (parent, tag, value) {
    var element = document.createElement(tag);
    element.classList.add(this.classes[0], this.concat(value));
    parent.appendChild(element);
  };

  handler.prototype.concat = function (value) {
    return this.classes[1].concat(value || 2);
  };

  handler.prototype.clearTile = function (parent) {
    parent.removeChild(parent.firstChild);
  };

  handler.prototype.listen = function (type, callback, target) {
    return target.addEventListener(type, callback, false);
  };

  handler.prototype.which = function (event) {
    return this.map[event.keyCode];
  };

  handler.prototype.eventHandler = function (callback, event) {
    var vector = this.which(event);
    if (vector) {callback(vector)};
  };
  window = window || {};
  window.handler = handler;
}(window));
