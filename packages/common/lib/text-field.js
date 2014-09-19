import { tagForType } from '../namespace';
import ChildComponentMixin from '../mixin/child';
import {
  TextField
} from 'ember';

var typeKey = 'text-field';

/**
  Text Field Component

  This component is a thin wrapper around Ember's `TextField` component that
  registers itself with its parent component.
*/
export default TextField.extend(ChildComponentMixin, {
  //
  // Internal Properties
  //

  typeKey: typeKey
});
