import {
  Mixin,
  A as EmberArray,
  get,
  computed,
  assert
} from 'ember';

export default Mixin.create({
  parent: computed.alias('parentView'),

  registerWithParent: function() {
    var parent = get(this, 'parent');

    assert("The '" + get(this, 'tagName') + "' component must be nested underneath another component'", parent && parent.registerComponent);

    parent.registerComponent(this);
  }.on('didInsertElement')
});
