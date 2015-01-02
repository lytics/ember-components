import { tagForType } from '../util/namespace';
import ParentComponentMixin from '../mixins/parent';
import ChildComponentMixin from '../mixins/child';
import Ember from 'ember';

var A         = Ember.A;
var Component = Ember.Component;
var get       = Ember.get;
var set       = Ember.set;
var computed  = Ember.computed;
var observer  = Ember.observer;
var run       = Ember.run;
var assert    = Ember.assert;

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
export default Component.extend(ParentComponentMixin, ChildComponentMixin, {
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
