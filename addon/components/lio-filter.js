import { tagForType } from '../util/namespace';
import ParentComponentMixin from '../mixins/parent';
import ChildComponentMixin from '../mixins/child';
import Ember from 'ember';

const A         = Ember.A;
const Component = Ember.Component;
const get       = Ember.get;
const set       = Ember.set;
const computed  = Ember.computed;
const observer  = Ember.observer;
const run       = Ember.run;
const assert    = Ember.assert;

const typeKey = 'filter';

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
    const interval = get(this, 'debounce');

    if (interval) {
      run.debounce(this, this.updateFilter, interval);
    } else {
      this.updateFilter();
    }
  }),

  updateFilter: function() {
    const filterValue = get(this, 'filterValue');
    const components = get(this, 'parent.filteredComponents');

    if (!filterValue) {
      components.invoke('set', 'filtered', false);
    } else {
      components.forEach(function(component) {
        const matches = fuzzyMatch(filterValue, component.$().text());

        set(component, 'filtered', !matches);
      });
    }
  }
});

// Simple fuzzy pattern matching using regular expressions, adapted from:
// http://codereview.stackexchange.com/questions/23899/faster-javascript-fuzzy-string-matching-function
function fuzzyMatch(pattern, str) {
  const cache = fuzzyMatch.cache || (fuzzyMatch.cache = {});
  let regexp = cache[pattern];

  if (!regexp) {
    regexp = cache[pattern] = new RegExp(pattern.split('').reduce(function(a, b) {
      return a + '[^' + b + ']*' + b;
    }), 'i');
  }

  return regexp.test(str);
}
