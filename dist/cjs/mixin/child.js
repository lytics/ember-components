"use strict";
var Mixin = require("ember").Mixin;
var EmberArray = require("ember").A;
var get = require("ember").get;
var computed = require("ember").computed;
var assert = require("ember").assert;

exports["default"] = Mixin.create({
  //
  // Internal Properties
  //

  parent: computed.alias('parentView'),

  //
  // Hooks / Observers
  //

  registerWithParent: function() {
    var parent = get(this, 'parent');

    if (!get(this, 'canBeTopLevel')) {
      assert("The '" + get(this, 'tagName') + "' component must be nested underneath another component'", parent && parent.registerComponent);
    }

    parent && parent.registerComponent && parent.registerComponent(this);
  }.on('willInsertElement'),

  notifyParent: function() {
    var parent = get(this, 'parent');
    parent && parent.didInsertComponent && parent.didInsertComponent(this);
  }.on('didInsertElement')
});