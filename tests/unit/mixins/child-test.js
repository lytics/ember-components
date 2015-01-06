import Ember from "ember";
import ChildMixin from '../../../mixins/child';
import {
  test
} from 'ember-qunit';

module('ChildMixin');

var TestComponent = Ember.Component.extend(ChildMixin);

test("it registers itself with its parent component before being inserted into the DOM", function() {
  var component = subjectFactory({
    parent: {
      registerComponent: function(object) {
        equal(component, object, '`registerComponent` called on parent component');
      }
    }
  });

  component.trigger('willInsertElement');
});

test("it notifies its parent component after being inserted into the DOM", function() {
  var component = subjectFactory({
    parent: {
      didInsertComponent: function(object) {
        equal(component, object, '`didInsertComponent` called on parent component');
      }
    }
  });

  component.trigger('didInsertElement');
});

test("it has a `parent` property that is a reference to its parent component", function() {
  var parent = {};
  var component = subjectFactory({
    parentView: parent
  });

  equal(component.get('parent'), parent, '`parent` property is alias for `parentView`');
});

function subjectFactory(props) {
  props = props || {};
  return TestComponent.create(props);
}