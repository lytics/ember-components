import Ember from 'ember';

const Mixin  = Ember.Mixin;
const A      = Ember.A;
const get    = Ember.get;
const set    = Ember.set;
const assert = Ember.assert;

export default Mixin.create({
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

  init: function() {
    this._super();

    set(this, 'components', A());
  },

  //
  // Internal Methods
  //

  registerComponent: function(component) {
    const type = get(component, 'typeKey');
    const allowed = get(this, 'allowedComponents');

    assert("All registered components must have a `typeKey` property, got '" + type + "'", typeof type === 'string');
    assert("A '" + get(component, 'tagName') + "' component cannot be nested within a '" + get(this, 'tagName') + "' component.", A(allowed).contains(type));

    get(this, 'components').pushObject(component);
  },

  // Hook stub to allow uses of `_super`
  didRegisterComponents: Ember.K,

  didInsertComponent: function() {
    // Once a component is actually in the DOM, we know that all components have been registered
    if (get(this, 'isInitializing')) {
      this.trigger('didRegisterComponents');
      set(this, 'isInitializing', false);
    }
  },

  componentsForType: function(type) {
    return A(get(this, 'components').filterBy('typeKey', type));
  }
});
