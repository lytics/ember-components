import namespace from '../namespace';
import ChildComponentMixin from '../mixin/child';
import {
  Component,
  get,
  computed
} from 'ember';

var typeKey = 'option';

export default Component.extend(ChildComponentMixin, {
  typeKey: typeKey,

  tagName: namespace + '-' + typeKey,

  classNameBindings: [ 'valueClass', 'isActive:active' ],

  valueClass: function() {
    return '' + get(this, 'value');
  }.property('value'),

  isActive: computed(function() {
    return get(this, 'value') === get(this, 'parent.value');
  }).property('value', 'parent.value')
});
