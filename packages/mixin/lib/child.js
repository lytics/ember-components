import {
  Mixin,
  A as EmberArray,
  get,
  computed,
  assert
} from 'ember';

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

    var parent = get(this, 'parent');

    if (!get(this, 'canBeTopLevel')) {
      assert("The '" + get(this, 'tagName') + "' component must be nested underneath another component'", parent && parent.registerComponent);
    }

    parent && parent.registerComponent && parent.registerComponent(this);
  },

  // Notify parent of insertion into DOM
  didInsertElement: function(view) {
    this._super(view);

    var parent = get(this, 'parent');
    parent && parent.didInsertComponent && parent.didInsertComponent(this);
  }
});
