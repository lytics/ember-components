"use strict";
var $ = require("ember").$;

// Taken from Bootstrap/Modernizr
function testTrasitionSupport() {
  var support = $.support.transition || false;

  // Test jQuery's support object so this doesn't have to happen multiple times
  // if bootstrap has already been included
  if (support) { return; }

  var endEventMap = {
    'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
    'MozTransition'    : 'transitionend',      // only for FF < 15
    'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
  };

  var el = document.createElement('transition-support');

  for (var name in endEventMap) {
    if (el.style[name] !== undefined) {
      support = { end: endEventMap[name] };
      break;
    }
  }

  $.support.transition = support;
}

exports.testTrasitionSupport = testTrasitionSupport;