"use strict";
var Component = require("ember").Component;
var computed = require("ember").computed;

exports["default"] = Component.extend({
  tagName: 'boolean-input-false',

  isVisible: computed.not('parentView.value'),

  registerWithParent: function() {

  }.on('didInsertElement')
});