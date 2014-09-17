import { tagForType } from '../namespace';
import ChildComponentMixin from '../mixin/child';
import ActiveStateMixin from '../mixin/active-state';
import TransitionMixin from '../mixin/transition';
import {
  Component,
  get,
  computed
} from 'ember';

var typeKey = 'option';

/**
  Option Component

  This component represents an option that the user can choose from. The value
  of the option is set through its `value` attribute, which a string
  representation of is set as a class.
*/
export default Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
  //
  // HTML Properties
  //

  tagName: tagForType(typeKey),

  classNameBindings: [ 'valueClass' ],

  //
  // Internal Properties
  //

  typeKey: typeKey,

  valueClass: computed(function() {
    return '' + get(this, 'value');
  }).property('value'),

  // Override the active state mixin's property to use the parent's value
  isActive: computed(function() {
    return get(this, 'value') === get(this, 'parent.value');
  }).property('value', 'parent.value')
});
