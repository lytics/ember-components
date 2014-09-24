"use strict";
var tagForType = require("../namespace").tagForType;
var ChildComponentMixin = require("../mixin/child")["default"] || require("../mixin/child");
var TextField = require("ember").TextField;

var typeKey = 'text-field';

/**
  Text Field Component

  This component is a thin wrapper around Ember's `TextField` component that
  registers itself with its parent component.
*/
exports["default"] = TextField.extend(ChildComponentMixin, {
  //
  // Internal Properties
  //

  typeKey: typeKey
});