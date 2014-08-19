define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Mixin = __dependency1__.Mixin;
    var EmberArray = __dependency1__.A;
    var get = __dependency1__.get;
    var set = __dependency1__.set;
    var assert = __dependency1__.assert;

    __exports__["default"] = Mixin.create({
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
  });