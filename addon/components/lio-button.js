import { tagForType } from '../util/namespace';
import ChildComponentMixin from '../mixins/child';
import Ember from 'ember';

const Component = Ember.Component;
const get       = Ember.get;
const computed  = Ember.computed;
const assert    = Ember.assert;

const typeKey = 'button';

/**
  Button Component

  This component creates a clickable element that sends an action to its parent
  component. The action name is specified by the `action` attribute, which is
  required.
  */
export default Component.extend(ChildComponentMixin, {
  //
  // HTML Properties
  //

  tagName: tagForType(typeKey),

  attributeBindings: [ 'action', 'disabled' ],

  classNameBindings: [ 'disabled' ],

  //
  // Handlebars Attributes
  //

  action: null,

  disabled: false,

  //
  // Internal Properties
  //

  typeKey: typeKey,

  isDisabled: computed.readOnly('disabled'),

  //
  // Event Handlers
  //

  click: function() {
    // Do not perform the action if the component is disabled
    if (get(this, 'isDisabled')) { return; }

    const action = get(this, 'action');

    assert("All '" + get(this, 'tagName') + "' components must define an `action` attribute.", action);

    get(this, 'parent').send(Ember.String.camelize(action));
  }
});
