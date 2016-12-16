(function(window) {
  'use strict';
  function handler(){
    this.classes = ['tile', 'tile-', 'position-'];
    this.map = {
      37: {x:-1,y:0},
      38: {x:0,y:-1},
      39: {x:1,y:0},
      40: {x:0,y:1}
    }
  }

  handler.prototype.createElement = function (parent, tag, value, classArray) {
    var element = document.createElement(tag);
    this.updateClasses(element,classArray)
    parent.appendChild(element);
  };

  handler.prototype.concat = function (value, position) {
    var cls = '';
    var pos = '';
    cls = this.classes[1].concat(value || 2);
    pos = this.classes[2].concat(position.x,'-',position.y);
    return cls.concat(pos);
  };

  handler.prototype.clearTile = function (parent) {
    parent.removeChild(parent.firstChild);
  };

  handler.prototype.listen = function (type, callback,target) {
    return target.addEventListener(type, callback, false);
  };

  handler.prototype.which = function (event) {
    return this.map[event.keyCode];
  };

  handler.prototype.eventHandler = function (callback, event) {
    var vector = this.which(event);
    if (vector) {return callback(vector)};
  };

  handler.prototype.updateClasses = function (element, classArray) {
    for (var i = 0; i < classArray.length; i++) {
      element.classList.add(classArray[i]);
    }
  };
  window = window || {};
  window.handler = handler;
}(window));
