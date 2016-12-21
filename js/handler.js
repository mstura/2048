(function(window) {
  'use strict';
  function handler(){
    this.classes = ['tile', 'tile-', 'position-'];
    this.container = document.querySelector('.tile-container');
    this.map = {
      37: {x:-1,y:0},
      38: {x:0,y:-1},
      39: {x:1,y:0},
      40: {x:0,y:1}
    }
  }

  handler.prototype.createElement = function (tag) {
    var element = document.createElement(tag);
    element.classList.add('tile');
    this.container.appendChild(element);
    return element;
  };

  handler.prototype.concat = function (value, position) {
    var cls = '';
    var pos = '';
    cls = this.classes[1].concat(value || 2);
    pos = this.classes[2].concat(position.x,'-',position.y);
    return cls.concat(pos);
  };

  handler.prototype.clearTile = function (element) {
    this.container.removeChild(element);
  };

  handler.prototype.listen = function (type, callback,target) {
    return target.addEventListener(type, callback, false);
  };

  handler.prototype.which = function (event) {
    return this.map[event.keyCode];
  };

  handler.prototype.eventHandler = function (event) {
    var vector = this.which(event);
    if (vector) {return vector};
  };

  handler.prototype.renderPosition = function (object, newPosition) {
    let np = 'position-';
    if (newPosition) {
      np = np.concat(newPosition.x,'-',newPosition.y);
    } else {
      np = np.concat(object.newPosition.x,'-',object.newPosition.y);
    }
    let element = object.pointer;
    element.classList.add(np);
    if (np !== object.classes[0]) {element.classList.remove(object.classes[0]);}
  };

  handler.prototype.renderTile = function (object) {
    if (object) {
      let element = object.pointer;
      let newClass = 'tile-'.concat(object.value);
      if (object.mergedfrom) {
        let extra = 'tile-'.concat(object.mergedfrom.value);
        element.classList.add(newClass);
        element.classList.remove(extra);
      }else if (newClass !== object.classes[1]) {
        element.classList.add(newClass);
      }
    }
  };

  window = window || {};
  window.handler = handler;
}(window));