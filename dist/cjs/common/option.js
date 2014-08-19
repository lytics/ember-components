"use strict";
var tagForType = require("../namespace").tagForType;
var ChildComponentMixin = require("../mixin/child")["default"] || require("../mixin/child");
var ActiveStateMixin = require("../mixin/active-state")["default"] || require("../mixin/active-state");
var TransitionMixin = require("../mixin/transition")["default"] || require("../mixin/transition");
var Component = require("ember").Component;
var get = require("ember").get;
var computed = require("ember").computed;

var typeKey = 'option';

/**
  Option Component

  This component represents an option that the user can choose from. The value
  of the option is set through its `value` attribute, which a string
  representation of is set as a class.
*/
exports["default"] = Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
  //
  // HTML Properties
  //

  tagName: tagForType(typeKey),

  classNameBindings: [ 'valueClass' ],

  //
  // Internal Properties
  //

  typeKey: typeKey,

  valueClass: function() {
    return '' + get(this, 'value');
  }.property('value'),

  // Override the active state mixin's property to use the parent's value
  isActive: computed(function() {
    return get(this, 'value') === get(this, 'parent.value');
  }).property('value', 'parent.value')
});