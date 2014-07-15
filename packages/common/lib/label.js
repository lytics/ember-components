import namespace from '../namespace';
import ChildComponentMixin from '../mixin/child';
import {
  Component,
  get
} from 'ember';

var typeKey = 'label';

/**
  Label Component

  This component acts as a symbol or short description usually for another
  content component.
*/
export default Component.extend(ChildComponentMixin, {
  typeKey: typeKey,

  tagName: namespace + '-' + typeKey,

  classNameBindings: [ 'active:active' ],

  active: false,

  click: function() {
    get(this, 'parent').send('labelFocus', this);
  }
});
