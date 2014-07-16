import { tagForType } from '../namespace';
import ChildComponentMixin from '../mixin/child';
import {
  Component,
  computed
} from 'ember';

var typeKey = 'content';

/**
  Content Component

  This component simply wraps a unit of content.
*/
export default Component.extend(ChildComponentMixin, {
  typeKey: typeKey,

  tagName: tagForType(typeKey),

  classNameBindings: [ 'isActive:active' ],

  active: false,

  isActive: computed.readOnly('active')
});
