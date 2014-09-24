define(
  ["../namespace","../mixin/child","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var Component = __dependency3__.Component;
    var get = __dependency3__.get;
    var computed = __dependency3__.computed;
    var assert = __dependency3__.assert;

    var typeKey = 'button';

    /**
      Button Component

      This component creates a clickable element that sends an action to its parent
      component. The action name is specified by the `action` attribute, which is
      required.
      */
    __exports__["default"] = Component.extend(ChildComponentMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      attributeBindings: [ 'action', 'disabled' ],

      classNameBindings: [ 'disabled' ],

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

        get(this, 'parent').send(Ember.String.camelize(action));
      }
    });
  });