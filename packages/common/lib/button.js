import { tagForType } from '../namespace';
import ChildComponentMixin from '../mixin/child';
import {
  Component,
  get,
  computed,
  assert
} from 'ember';

var typeKey = 'button';

/**
  Button Component

  This component creates a clickable element that sends an action to its parent
  component. The action name is specified by the `action` attribute, which is
  required.
  */
export default Component.extend(ChildComponentMixin, {
  typeKey: typeKey,

  tagName: tagForType(typeKey),

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
