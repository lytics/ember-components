"use strict";
var BooleanInputComponent = require("./input")["default"] || require("./input");
var BooleanInputTrueComponent = require("./true")["default"] || require("./true");
var BooleanInputFalseComponent = require("./false")["default"] || require("./false");
var Application = require("ember").Application;

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