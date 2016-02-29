import Ember from 'ember';

// Taken from Bootstrap/Modernizr
function testTrasitionSupport() {
  let support = $.support.transition || false;

  // Test jQuery's support object so this doesn't have to happen multiple times
  // if bootstrap has already been included
  if (support) { return; }

  const endEventMap = {
    'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
    'MozTransition'    : 'transitionend',      // only for FF < 15
    'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
  };

  const el = document.createElement('transition-support');

  for (let name in endEventMap) {
    if (el.style[name] !== undefined) {
      support = { end: endEventMap[name] };
      break;
    }
  }

  Ember.$.support.transition = support;
}

export {
  testTrasitionSupport
};
