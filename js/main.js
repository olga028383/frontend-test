$(document).ready(function () {
  $('select').styler({
    selectPlaceholder: 'Год рождения'
  });

  $('.jq-selectbox ul').mCustomScrollbar({
    axis: "y",
    theme: "dark"
  });
});

var slider = document.getElementById('slider');
var thumb = slider.querySelector('.slider__thumb');
var bg = slider.querySelector('.slider__line');
var label = slider.querySelectorAll('.slider__label');

function Slider(options) {
  if (!options.elem || !options.cursor)
    return;
  this.elem = options.elem;
  this.thumb = options.cursor;
  this.position = options.position;
  this.line = options.line;
  this.checkedPosition = 0;
  this.shiftX;
  this.shiftY;
  this.off;
  this.on;
  this.direction = "right";
  var self = this;
  this.cursorDown = this.cursorDown.bind(this);
  this.moveAt = this.moveAt.bind(this);
  this.cursorUp = this.cursorUp.bind(this);
  this.thumb.addEventListener('mousedown', this.cursorDown);
  this.thumb.ondragstart = function () {
    return false;
  };
}

Slider.prototype.cursorDown = function (e) {
  e = e || event;
  this.thumb.classList.remove('stop');
  var target = e.target;
  var coords = this.getCoords(target);
  this.shiftX = e.pageX - coords.left - 10;//8

  document.addEventListener('mousemove', this.moveAt);
  document.addEventListener('mouseup', this.cursorUp);

  return false;
};

Slider.prototype.moveAt = function (e) {
  e.preventDefault();
  var positionElemLeft = this.setCoordsElem(e);

  if (positionElemLeft.left < 0) {
    positionElemLeft.left = 0;
  }

  if (positionElemLeft.left > this.elem.offsetWidth) {
    positionElemLeft.left = this.elem.offsetWidth;
  }
  this.getSelect(positionElemLeft.left);

  this.thumb.style.left = positionElemLeft.left + 'px';
  this.line.style.width = positionElemLeft.left + 'px';
};
Slider.prototype.getSelect = function (check) {
  for (var i = 0; i < this.position.length; i++) {
    this.position[i].classList.remove('slider__label--active');
    
    var coords = this.getCoords(this.position[i]);
    var left = coords.left - this.getCoords(this.elem).left;
    
    if (left <= check 
        && this.position[i].offsetWidth + left > check) {
        this.position[i].classList.add('slider__label--active');
    }
    if(this.position[i-1]){
      if (left <= check 
        && this.position[i].offsetWidth + left >= check) {
        this.position[i].classList.add('slider__label--active');
      }
    }
    if (this.position[i].classList.contains('slider__label--active')) {
      this.position[i].querySelector('.slider__field').checked = true;
    } else {
      this.position[i].querySelector('.slider__field').checked = false;
    }
  }
};
Slider.prototype.cursorUp = function (e) {
  document.removeEventListener('mousemove', this.moveAt);
  document.removeEventListener('mouseup', this.cursorUp);
};

Slider.prototype.setCoordsElem = function (e) {
  var positionElem = this.getCoords(this.elem);
  return {
    left: e.pageX - this.shiftX - positionElem.left
  };
};

Slider.prototype.getCoords = function (elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
};

function MenuMobile() {
  this.menu = document.querySelector('.header');
  this.btn = this.menu.querySelector('.header__button');

  this.menu.classList.remove('header--nojs');
  this.menu.classList.add('header--close');

  this.toggleMenu = this.toggleMenu.bind(this);

  this.btn.addEventListener('click', this.toggleMenu);
}

MenuMobile.prototype.toggleMenu = function () {
  this.menu.classList.toggle('header--close');
};

new MenuMobile;

var newslider = new Slider({
  elem: slider,
  cursor: thumb,
  position: label,
  line: bg
});
