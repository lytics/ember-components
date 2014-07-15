import namespace from '../namespace';
import ChildComponentMixin from '../mixin/child';
import {
  Component,
  get
} from 'ember';

var typeKey = 'label';

export default Component.extend(ChildComponentMixin, {
  typeKey: typeKey,

  tagName: namespace + '-' + typeKey,

  classNameBindings: [ 'active:active' ],

  active: false,

  click: function() {
    get(this, 'parent').send('labelFocus', this);
  }
});
