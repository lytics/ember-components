define(
  ["../namespace","../mixin/parent","../mixin/child","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ParentComponentMixin = __dependency2__["default"] || __dependency2__;
    var ChildComponentMixin = __dependency3__["default"] || __dependency3__;
    var A = __dependency4__.A;
    var Component = __dependency4__.Component;
    var get = __dependency4__.get;
    var set = __dependency4__.set;
    var computed = __dependency4__.computed;
    var observer = __dependency4__.observer;
    var run = __dependency4__.run;
    var assert = __dependency4__.assert;

    var typeKey = 'filter';

    /**
      Filter Component

      This component provides an interface for filtering a set of components. The
      text field component provides the filter pattern and an optional button can
      be provided to clear the text field. Components are filtered based on their
      `innerText`, and when filtered out, the `filtered` property is set to true.

      ```handlebars
      {{#lio-filter}}
        {{lio-text-field}}
        {{lio-button action="clear"}}
      {{/lio-multi-select}}
      ```
    */
    __exports__["default"] = Component.extend(ParentComponentMixin, ChildComponentMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      //
      // Handlebars Attributes
      //

      value: null,

      debounce: 200,

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'text-field', 'button' ],

      textFieldComponent: computed(function() {
        return get(this.componentsForType('text-field'), 'firstObject');
      }).property('components.[]'),

      filterValue: computed.alias('textFieldComponent.value'),

      //
      // Internal Actions
      //

      actions: {
        clear: function() {
          set(this, 'filterValue', '');
          this.updateFilter();
        }
      },

      //
      // Hooks / Observers
      //

      // Verify dependencies and initialized CPs
      didRegisterComponents: function() {
        this._super();

        assert("The '" + get(this, 'tagName') + "' component must contain a single 'lio-text-field' component.", this.componentsForType('text-field').length === 1);

        // Prime the computed property so that it can be observed
        get(this, 'textFieldComponent');
      },

      debouncedFilterUpdate: Ember.observer('filterValue', function() {
        var interval = get(this, 'debounce');

        if (interval) {
          run.debounce(this, this.updateFilter, interval);
        } else {
          this.updateFilter();
        }
      }),

      updateFilter: function() {
        var filterValue = get(this, 'filterValue');
        var components = get(this, 'parent.filteredComponents');

        if (!filterValue) {
          components.invoke('set', 'filtered', false);
        } else {
          components.forEach(function(component) {
            var matches = fuzzyMatch(filterValue, component.$().text());

            set(component, 'filtered', !matches);
          });
        }
      }
    });

    // Simple fuzzy pattern matching using regular expressions, adapted from:
    // http://codereview.stackexchange.com/questions/23899/faster-javascript-fuzzy-string-matching-function
    function fuzzyMatch(pattern, str) {
      var cache = fuzzyMatch.cache || (fuzzyMatch.cache = {});
      var regexp = cache[pattern];

      if (!regexp) {
        regexp = cache[pattern] = new RegExp(pattern.split('').reduce(function(a, b) {
          return a + '[^' + b + ']*' + b;
        }), 'i');
      }

      return regexp.test(str);
    }
  });