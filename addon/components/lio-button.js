import { tagForType } from '../util/namespace';
import ChildComponentMixin from '../mixins/child';
import Ember from 'ember';

var Component = Ember.Component;
var get       = Ember.get;
var computed  = Ember.computed;
var assert    = Ember.assert;

var typeKey = 'button';

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

    var action = get(this, 'action');

    assert("All '" + get(this, 'tagName') + "' components must define an `action` attribute.", action);

    get(this, 'parent').send(Ember.String.camelize(action));
  }
});
