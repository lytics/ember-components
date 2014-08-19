"use strict";
var tagForType = require("../namespace").tagForType;
var ChildComponentMixin = require("../mixin/child")["default"] || require("../mixin/child");
var ActiveStateMixin = require("../mixin/active-state")["default"] || require("../mixin/active-state");
var Component = require("ember").Component;
var get = require("ember").get;

var typeKey = 'label';

/**
  Label Component

  This component acts as a symbol or short description usually for another
  content component.
*/
exports["default"] = Component.extend(ChildComponentMixin, ActiveStateMixin, {
  //
  // HTML Properties
  //

  tagName: tagForType(typeKey),

  //
  // Internal Properties
  //

  typeKey: typeKey,

  //
  // Event Handlers
  //

  click: function() {
    get(this, 'parent').send('labelFocus', this);
  }
});