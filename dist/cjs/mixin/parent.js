"use strict";
var Mixin = require("ember").Mixin;
var EmberArray = require("ember").A;
var get = require("ember").get;
var set = require("ember").set;
var assert = require("ember").assert;

exports["default"] = Mixin.create({
  //
  // Internal Properties
  //

  concatenatedProperties: [ 'allowedComponents' ],

  allowedComponents: [],

  isInitializing: true,

  components: null,

  //
  // Hooks / Observers
  //

  initComponents: function() {
    set(this, 'components', EmberArray());
  }.on('init'),

  //
  // Internal Methods
  //

  registerComponent: function(component) {
    var type = get(component, 'typeKey');
    var allowed = get(this, 'allowedComponents');

    assert("All registered components must have a `typeKey` property, got '" + type + "'", typeof type === 'string');
    assert("A '" + get(component, 'tagName') + "' component cannot be nested within a '" + get(this, 'tagName') + "' component.", EmberArray(allowed).contains(type));

    get(this, 'components').pushObject(component);
  },

  didInsertComponent: function() {
    // Once a component is actually in the DOM, we know that all components have been registered
    if (get(this, 'isInitializing')) {
      this.trigger('didRegisterComponents');
      set(this, 'isInitializing', false);
    }
  },

  componentsForType: function(type) {
    return get(this, 'components').filterBy('typeKey', type);
  }
});