import { tagForType } from '../util/namespace';
import ChildComponentMixin from '../mixins/child';
import ActiveStateMixin from '../mixins/active-state';
import TransitionMixin from '../mixins/transition';
import {
  Component
} from 'ember';

var typeKey = 'content';

/**
  Content Component

  This component simply wraps a unit of content.
*/
export default Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
  //
  // HTML Properties
  //

  tagName: tagForType(typeKey),

  //
  // Internal Properties
  //

  typeKey: typeKey
});
