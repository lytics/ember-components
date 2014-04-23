!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),(n.Lytics||(n.Lytics={})).Components=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Component = window.Ember.Component;
var computed = window.Ember.computed;

exports["default"] = Component.extend({
  tagName: 'boolean-input-false',

  isVisible: computed.not('parentView.value'),

  registerWithParent: function() {

  }.on('didInsertElement')
});
},{}],2:[function(_dereq_,module,exports){
"use strict";
var Component = window.Ember.Component;

exports["default"] = Component.extend({
  tagName: 'boolean-input',

  classNameBindings: [ 'value:true:false', 'disabled' ],

  value: null,

  disabled: false,

  actions: {
    toggle: function() {
      if (!this.get('disabled')) {
        Ember.run(this, 'toggleProperty', 'value');
        this.sendAction('action', this.get('value'));
      }
    }
  },

  click: function() {
    this.send('toggle');
  },

  keyPress: function(event) {
    if (event.which === 13) {
      this.send('toggle');
    }
  }
});
},{}],3:[function(_dereq_,module,exports){
"use strict";
var BooleanInputComponent = _dereq_("./input")["default"] || _dereq_("./input");
var BooleanInputTrueComponent = _dereq_("./true")["default"] || _dereq_("./true");
var BooleanInputFalseComponent = _dereq_("./false")["default"] || _dereq_("./false");
var Application = window.Ember.Application;

Application.initializer({
  name: 'booleanInputComponent',
  initialize: function(container) {
    container.register('component:boolean-input', BooleanInputComponent);
    container.register('component:boolean-input-true', BooleanInputTrueComponent);
    container.register('component:boolean-input-false', BooleanInputFalseComponent);
  }
});

exports.BooleanInputComponent = BooleanInputComponent;
exports.BooleanInputTrueComponent = BooleanInputTrueComponent;
exports.BooleanInputFalseComponent = BooleanInputFalseComponent;
},{"./false":1,"./input":2,"./true":4}],4:[function(_dereq_,module,exports){
"use strict";
var Component = window.Ember.Component;
var computed = window.Ember.computed;

exports["default"] = Component.extend({
  tagName: 'boolean-input-true',

  isVisible: computed.alias('parentView.value'),

  registerWithParent: function() {

  }.on('didInsertElement')
});
},{}],5:[function(_dereq_,module,exports){
"use strict";
var BooleanInputComponent = _dereq_("./boolean/main").BooleanInputComponent;
var BooleanInputTrueComponent = _dereq_("./boolean/main").BooleanInputTrueComponent;
var BooleanInputFalseComponent = _dereq_("./boolean/main").BooleanInputFalseComponent;

exports.BooleanInputComponent = BooleanInputComponent;
exports.BooleanInputTrueComponent = BooleanInputTrueComponent;
exports.BooleanInputFalseComponent = BooleanInputFalseComponent;
},{"./boolean/main":3}]},{},[5])
(5)
});