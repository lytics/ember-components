import { tagForType } from '../namespace';
import ChildComponentMixin from '../mixin/child';
import ActiveStateMixin from '../mixin/active-state';
import TransitionMixin from '../mixin/transition';
import {
  Component
} from 'ember';

var typeKey = 'content';

/**
  Content Component

  This component simply wraps a unit of content.
*/
export default Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
  typeKey: typeKey,

  tagName: tagForType(typeKey)
});
