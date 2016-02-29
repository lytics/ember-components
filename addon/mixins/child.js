import Ember from 'ember';

const Mixin    = Ember.Mixin;
const get      = Ember.get;
const set      = Ember.set;
const computed = Ember.computed;
const assert   = Ember.assert;

export default Mixin.create({
  //
  // Internal Properties
  //

  parent: computed.alias('parentView'),

  //
  // Hooks / Observers
  //

  // Register self with parent component
  willInsertElement: function(view) {
    this._super(view);

    const parent = get(this, 'parent');

    if (!get(this, 'canBeTopLevel')) {
      assert("The '" + get(this, 'tagName') + "' component must be nested underneath another component'", parent && typeof parent.registerComponent === 'function');
    }

    parent && parent.registerComponent && parent.registerComponent(this);
  },

  // Notify parent of insertion into DOM
  didInsertElement: function(view) {
    this._super(view);

    const parent = get(this, 'parent');
    parent && parent.didInsertComponent && parent.didInsertComponent(this);
  }
});
