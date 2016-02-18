import Ember from "ember";
import ActiveStateMixin from 'lytics-ember-components/mixins/active-state';
import {
  test
} from 'ember-qunit';

module('ActiveStateMixin');

var TestComponent = Ember.Object.extend(ActiveStateMixin);

test("the active state defaults to false", function() {
  var component = subjectFactory();

  ok(!component.get('active'), "it is not active");
});

test("it has the 'active'/'inactive' classes based on active state", function() {
  var component = subjectFactory();

  ok(!component.get('isVisuallyActive'), "it does not have the 'active' class");
  Ember.run(component, 'set', 'active', true);
  ok(component.get('isVisuallyActive'), "it has the 'active' class");
});

test("it has the 'active' class immediately after insertion when transitions are enabled", function() {
  var component = subjectFactory({
    // The existence of the `withTransition` method indicates transitions are available
    withTransition: function() {},
    active: true
  });

  ok(component.get('isVisuallyActive'), "it has the 'active' class");
});

// test("it adds the 'active' class after transitions are done", function() {
//   var callback;
//   var component = subjectFactory({
//     // Stub `withTransition` instead of using transition mixin directly
//     withTransition: function(className, fn) {
//       callback = fn.bind(component);
//     }
//   });

//   Ember.run(component, 'set', 'active', true);
//   ok(!component.get('isVisuallyActive'), "it does not have the 'active' class");
//   Ember.run(callback);
//   ok(component.get('isVisuallyActive'), "it has the 'active' class");
// });

function subjectFactory(props) {
  props = props || {};
  return TestComponent.create(props);
}
