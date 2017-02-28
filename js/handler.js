(function(window) {
  'use strict';
  function handler(){
    this.scoreContainer = document.querySelector('.score-container');
    this.container = document.querySelector('.tile-container');
    this.loseState = document.querySelector('.game-message');
    this.ngBTN = document.querySelector('.restart');
    this.timeBTN = document.querySelector('.takeBack');

    this.map = {
      37: {x:-1,y:0},
      38: {x:0,y:-1},
      39: {x:1,y:0},
      40: {x:0,y:1}
    }
  }

  handler.prototype.scoreUpdate = function (value) {
    this.scoreContainer.innerHTML = value;
  };

  handler.prototype.modCls = function (className, target, action) {
    switch (action) {
      case 'add':
        target.classList.add(className);
        break;
      case 'remove':
        target.classList.remove(className);
        break;
      case 'clear':
        target.className = '';
        break;
      case 'fill':
        target.className = className;
        break;
    }
  };

  handler.prototype.createElement = function (tag) {
    var element = document.createElement(tag);
    element.classList.add('tile');
    this.container.appendChild(element);
    return element;
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
    this.modCls(np,element,'add');
    if (np !== object.classes[0]) {this.modCls(object.classes[0],element,'remove');}
  };

  handler.prototype.renderTile = function (object) {
    if (object) {
      let element = object.pointer;
      let newClass = 'tile-'.concat(object.value);
      if (object.mergedfrom) {
        let extra = 'tile-'.concat(object.mergedfrom.value);
        this.modCls(newClass,element,'add');
        this.modCls(extra,element,'remove');
      }else if (newClass !== object.classes[1]) {
        this.modCls(newClass,element,'add');
      }
    }
  };

  window = window || {};
  window.handler = handler;
}(window));
