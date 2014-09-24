define(
  ["../namespace","../mixin/parent","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ParentComponentMixin = __dependency2__["default"] || __dependency2__;
    var A = __dependency3__.A;
    var Component = __dependency3__.Component;
    var get = __dependency3__.get;
    var set = __dependency3__.set;
    var computed = __dependency3__.computed;
    var observer = __dependency3__.observer;
    var run = __dependency3__.run;
    var assert = __dependency3__.assert;

    var typeKey = 'multi-select';

    /**
      Multi Select Component

      This component selects multiple values from a set of options. The `values`
      attribute is an array of values that is kept in sync with the `value`
      attributes of all options in the selected state. There are two actions for
      bulk updating the selected state of options: `select-all` and `unselect-all`.

      ```handlebars
      {{#lio-multi-select}}
        {{#lio-option value="one"}}One{{/lio-option}}
        {{#lio-option value="two"}}Two{{/lio-option}}
        {{#lio-option value="three"}}Three{{/lio-option}}

        {{lio-button action="select-all"}}
        {{lio-button action="unselect-all"}}
      {{/lio-multi-select}}
      ```
    */
    __exports__["default"] = Component.extend(ParentComponentMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      classNameBindings: [ 'disabled' ],

      //
      // Handlebars Attributes
      //

      disabled: false,

      values: null,

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'option', 'button', 'filter' ],

      isDisabled: computed.readOnly('disabled'),

      allOptionComponents: computed.filterBy('components', 'typeKey', 'option'),

      optionComponents: computed.filterBy('allOptionComponents', 'unselect', false),

      filteredComponents: computed.readOnly('optionComponents'),

      optionCount: computed.readOnly('optionComponents.length'),

      selectedOptionCount: computed.readOnly('values.length'),

      selectAllButton: computed(function() {
        return this.componentsForType('button').findBy('action', 'select-all');
      }).property('components.[]'),

      unselectAllButton: computed(function() {
        return this.componentsForType('button').findBy('action', 'unselect-all');
      }).property('components.[]'),

      //
      // Internal Actions
      //

      actions: {
        selectAll: function() {
          this.runAction(function() {
            this.suspendOptionObservers(function() {
              get(this, 'optionComponents').invoke('set', 'selected', true);
            });
            this.syncValues();
          });
        },

        unselectAll: function() {
          this.runAction(function() {
            this.suspendOptionObservers(function() {
              get(this, 'optionComponents').invoke('set', 'selected', false);
            });
            this.syncValues();
          });
        },

        select: function(optionValue, selectedState) {
          this.runAction(function() {
            var option = get(this, 'optionComponents').findBy('value', optionValue);

            if (selectedState === undefined) {
              selectedState = true;
            }

            option && set(option, 'selected', selectedState);
          });
        }
      },

      runAction: function(callback) {
        if (get(this, 'isDisabled')) { return; }

        run(this, callback);

        this.sendAction('action', get(this, 'values'));
      },

      //
      // Hooks / Observers
      //

      // Sync initial state of values/options
      didRegisterComponents: function() {
        this._super();

        assert("Options in '" + get(this, 'tagName') + "' components cannot contain duplicate values.", get(this, 'optionComponents').length === A(get(this, 'optionComponents').mapBy('value')).uniq().length);

        // If `values` is set, use it as the source of truth, otherwise use the
        // `selected` state of option components
        if (get(this, 'values')) {
          this.syncOptions();
        } else {
          this.syncValues();
        }

        this.setButtonState();
      },

      updateValues: observer('optionComponents.@each.{isSelected,value}', function(obj, key) {
        if (this._suspendOptionObservers || get(this, 'isInitializing')) { return; }

        this.syncValues();
      }),

      updateOptions: observer('values.[]', function() {
        if (get(this, 'isInitializing')) { return; }

        this.suspendOptionObservers(function() {
          this.syncOptions();
        });

        this.setButtonState();
      }),

      // Update values to reflect the `selected` state of all options
      syncValues: function() {
        var selectedOptions = A(get(this, 'optionComponents').filterBy('isSelected'));

        // The `values` attribute must be set to a new array reflecting the state
        // of selected options; manipulating the array is not compatible with
        // bindings that point to computed properties
        set(this, 'values', A(selectedOptions.mapBy('value')));
      },

      // Update the `selected` state of all options to reflect current values
      syncOptions: function() {
        var options = get(this, 'allOptionComponents');
        var values = A(get(this, 'values') || []);

        assert("The 'value' attribute of '" + get(this, 'tagName') + "' components must not contain duplicate values.", get(values, 'length') === get(values.uniq(), 'length'));

        options.forEach(function(option) {
          set(option, 'selected', values.contains(get(option, 'value')));
        });
      },

      // Disable/enable action buttons
      setButtonState: function() {
        var total = get(this, 'optionCount');
        var selected = get(this, 'selectedOptionCount');
        var selectAllButton = get(this, 'selectAllButton');
        var unselectAllButton = get(this, 'unselectAllButton');

        selectAllButton && set(selectAllButton, 'disabled', selected === total);
        unselectAllButton && set(unselectAllButton, 'disabled', selected === 0);
      },

      // Temporarily prevent option observers from having an effect to allow for
      // batch option updates
      suspendOptionObservers: function(callback) {
        this._suspendOptionObservers = true;
        callback.call(this);
        this._suspendOptionObservers = false;
      }
    });
  });