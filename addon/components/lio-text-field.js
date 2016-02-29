import { tagForType } from '../util/namespace';
import ChildComponentMixin from '../mixins/child';
import Ember from 'ember';

const TextField = Ember.TextField;

const typeKey = 'text-field';

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
