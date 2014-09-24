define(
  ["../namespace","../mixin/parent","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ParentComponentMixin = __dependency2__["default"] || __dependency2__;
    var Component = __dependency3__.Component;
    var get = __dependency3__.get;
    var set = __dependency3__.set;
    var run = __dependency3__.run;
    var computed = __dependency3__.computed;
    var assert = __dependency3__.assert;

    var typeKey = 'toggle';

    /**
      Toggle Component

      This component switches its value between two options. The possible values
      are taken from the `value` attribute of each option. When the component is
      'toggled', its value is changed to that of the next option.  At any given
      time the option with the value that matches the component's is marked as
      active.

      ```handlebars
      {{#lio-toggle defaultValue=false}}
        {{#lio-option value=true}}Yes{{/lio-option}}
        {{#lio-option value=false}}No{{/lio-option}}
      {{/lio-toggle}}
      ```
    */
    __exports__["default"] = Component.extend(ParentComponentMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      classNameBindings: [ 'valueClass', 'disabled' ],

      //
      // Handlebars Attributes
      //

      disabled: false,

      defaultValue: false,

      value: computed.oneWay('defaultValue'),

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'option' ],

      valueClass: computed(function() {
        return '' + get(this, 'value');
      }).property('value'),

      possibleValues: computed(function() {
        return this.componentsForType('option').mapBy('value');
      }).property('components.[]'),

      //
      // Internal Actions
      //

      actions: {
        toggle: function() {
          if (!get(this, 'disabled')) {
            run(this, function() {
              var current = get(this, 'value');
              var possible = get(this, 'possibleValues');
              var nextIndex = possible.indexOf(current) + 1;

              // Wrap around to the first value
              if (nextIndex === get(possible, 'length')) {
                nextIndex = 0;
              }

              set(this, 'value', possible[nextIndex]);
            });

            this.sendAction('action', get(this, 'value'));
          }
        }
      },

      //
      // Event Handlers
      //

      click: function() {
        this.send('toggle');
      },

      keyPress: function(event) {
        if (event.which === 13) {
          this.send('toggle');
        }
      },

      //
      // Hooks / Observers
      //

      // Verify dependencies and initialize the default value
      didRegisterComponents: function() {
        this._super();

        assert("The '" + get(this, 'tagName') + "' component must contain at exactly two 'lio-option' components.", get(this.componentsForType('option'), 'length') === 2);

        var value = get(this, 'value');
        var defaultValue = get(this, 'defaultValue');

        // Only set the default if there's currently no value
        if (value === undefined && defaultValue !== undefined) {
          set(this, 'value', defaultValue);
        }
      }
    });
  });