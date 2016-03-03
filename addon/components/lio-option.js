import { tagForType } from '../util/namespace';
import ChildComponentMixin from '../mixins/child';
import ActiveStateMixin from '../mixins/active-state';
import TransitionMixin from '../mixins/transition';
import Ember from 'ember';

const Component = Ember.Component;
const get       = Ember.get;
const set       = Ember.set;
const computed  = Ember.computed;
const uuid      = Ember.uuid;

const typeKey = 'option';

/**
  Option Component

  This component represents an option that the user can choose from. The value
  of the option is set through its `value` attribute, which defaults to the
  template's context if omitted (this makes looping over options easy). Options
  have a 'selected' state which is managed by the parent component, and an
  optional 'unselect' attribute which effectively makes the option a 'remove'
  button (with a value). When clicked, options send the 'select' event to their
  parent with its value, which can be disabled using the 'disabled' state.
  Options also have a class binding for an intelligent string representation of
  its value.
*/
export default Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
  //
  // HTML Properties
  //

  tagName: tagForType(typeKey),

  classNameBindings: [ 'valueClass', 'disabled', 'selected', 'unselect', 'filtered' ],

  //
  // Handlebars Attributes
  //

  option: null,

  value: computed(function() {
    // The 'content' path is the current context
    const path = this.get('valuePath');
    const option = this.get('option');

    return option && get(option, path);
  }).property('option', 'valuePath'),

  valuePath: computed.oneWay('parent.optionValuePath'),

  selected: false,

  unselect: false,

  disabled: computed.oneWay('parent.disabled'),

  filtered: false,

  //
  // Internal Properties
  //

  typeKey: typeKey,

  isSelected: computed.readOnly('selected'),

  isUnselect: computed.readOnly('unselect'),

  isDisabled: computed.readOnly('disabled'),

  isFiltered: computed.readOnly('filtered'),

  valueClass: computed(function() {
    let value = get(this, 'value');
    const type = Ember.typeOf(value);

    // Avoid '[Object object]' classes and complex toString'd values
    if (type === 'object' || type === 'instance') {
      // Look for an identifier, fall back on a uuid
      value = get(value, 'id') || ('option-' + get(this, 'uuid'));
    }

    return '' + value;
  }).property('value'),

  uuid: computed(function() {
    return uuid();
  }).property(),

  // Override the active state mixin's property to use the parent's value
  isActive: computed(function() {
    return get(this, 'value') === get(this, 'parent.value');
  }).property('value', 'parent.value'),

  //
  // Event Handlers
  //

  click: function() {
    // Do not perform the action if the component is disabled
    if (get(this, 'isDisabled')) { return; }

    const parent = get(this, 'parent');
    const isUnselect = get(this, 'isUnselect');
    const isSelected = get(this, 'isSelected');
    const value = get(this, 'value');

    // Don't set the select state directly; let the parent manage the state
    parent.send('select', value, isUnselect ? false : !isSelected);
  }
});
