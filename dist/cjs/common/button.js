"use strict";
var tagForType = require("../namespace").tagForType;
var ChildComponentMixin = require("../mixin/child")["default"] || require("../mixin/child");
var Component = require("ember").Component;
var get = require("ember").get;
var computed = require("ember").computed;
var assert = require("ember").assert;

var typeKey = 'button';

/**
  Button Component

  This component creates a clickable element that sends an action to its parent
  component. The action name is specified by the `action` attribute, which is
  required.
  */
exports["default"] = Component.extend(ChildComponentMixin, {
  //
  // HTML Properties
  //

  tagName: tagForType(typeKey),

  attributeBindings: [ 'action', 'disabled' ],

  //
  // Handlebars Attributes
  //

  action: null,

  disabled: false,

  //
  // Internal Properties
  //

  typeKey: typeKey,

  isDisabled: computed.readOnly('disabled'),

  //
  // Event Handlers
  //

  click: function() {
    // Do not perform the action if the component is disabled
    if (get(this, 'isDisabled')) { return; }

    var action = get(this, 'action');

    assert("All '" + get(this, 'tagName') + "' components must define an `action` attribute.", action);

    get(this, 'parent').send(action);
  }
});