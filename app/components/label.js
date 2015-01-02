import { tagForType } from '../util/namespace';
import ChildComponentMixin from '../mixins/child';
import ActiveStateMixin from '../mixins/active-state';
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
export default Component.extend(ChildComponentMixin, ActiveStateMixin, {
  //
  // HTML Properties
  //

  tagName: tagForType(typeKey),

  //
  // Internal Properties
  //

  typeKey: typeKey,

  //
  // Event Handlers
  //

  click: function() {
    get(this, 'parent').send('labelFocus', this);
  }
});
