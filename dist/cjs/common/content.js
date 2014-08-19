"use strict";
var tagForType = require("../namespace").tagForType;
var ChildComponentMixin = require("../mixin/child")["default"] || require("../mixin/child");
var ActiveStateMixin = require("../mixin/active-state")["default"] || require("../mixin/active-state");
var TransitionMixin = require("../mixin/transition")["default"] || require("../mixin/transition");
var Component = require("ember").Component;

var typeKey = 'content';

/**
  Content Component

  This component simply wraps a unit of content.
*/
exports["default"] = Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
  //
  // HTML Properties
  //

  tagName: tagForType(typeKey),

  //
  // Internal Properties
  //

  typeKey: typeKey
});