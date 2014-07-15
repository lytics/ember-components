import namespace from '../namespace';
import ChildComponentMixin from '../mixin/child';
import {
  Component,
  get,
  computed,
  assert
} from 'ember';

var typeKey = 'button';

export default Component.extend(ChildComponentMixin, {
  typeKey: typeKey,

  tagName: namespace + '-' + typeKey,

  attributeBindings: [ 'action', 'disabled' ],

  action: null,

  disabled: false,

  isDisabled: computed.readOnly('disabled'),

  click: function() {
    // Do not perform the action if the component is disabled
    if (get(this, 'isDisabled')) { return; }

    var action = get(this, 'action');

    assert("All '" + get(this, 'tagName') + "' components must define an `action` attribute.", action);

    get(this, 'parent').send(action);
  }
});
