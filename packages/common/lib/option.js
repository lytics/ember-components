import { tagForType } from '../namespace';
import ChildComponentMixin from '../mixin/child';
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
export default Component.extend(ChildComponentMixin, {
  typeKey: typeKey,

  tagName: tagForType(typeKey),

  classNameBindings: [ 'valueClass', 'isActive:active' ],

  valueClass: function() {
    return '' + get(this, 'value');
  }.property('value'),

  isActive: computed(function() {
    return get(this, 'value') === get(this, 'parent.value');
  }).property('value', 'parent.value')
});
