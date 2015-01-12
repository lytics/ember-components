import Ember from "ember";
import ParentMixin from 'lytics-ember-components/mixins/parent';
import {
  test
} from 'ember-qunit';

module('ParentMixin');

var TestComponent = Ember.Component.extend(ParentMixin);

test("it does not allow components without a type key to register themselves", function() {
  var component = {};
  var object = subjectFactory({
    allowedComponents: [ 'foo' ]
  });

  throws(function() {
    object.registerComponent(component);
  }, /All registered components must have a `typeKey` property, got 'undefined'/);
});

test("it does not allow non-whitelisted components to register themselves", function() {
  var component = {
    tagName: 'lio-bar',
    typeKey: 'bar'
  };
  var object = subjectFactory({
    tagName: 'lio-foo',
    allowedComponents: [ 'foo' ]
  });

  throws(function() {
    object.registerComponent(component);
  }, /A 'lio-bar' component cannot be nested within a 'lio-foo' component./);
});

test("it allows whitelisted child components to register themselves", function() {
  var component = { typeKey: 'foo' };
  var object = subjectFactory({
    allowedComponents: [ 'foo' ]
  });

  ok(typeof object.registerComponent, 'function', "has `registerComponent` method");

  object.registerComponent(component);
  ok(true, 'whitelisted components can be registered');
});

test("it maintains an array of all registered components", function() {
  var component1 = { typeKey: 'foo' };
  var component2 = { typeKey: 'foo' };
  var object = subjectFactory({
    allowedComponents: [ 'foo' ]
  });

  object.registerComponent(component1);
  object.registerComponent(component2);

  deepEqual(object.get('components'), [ component1, component2 ], "keeps track of registered components");
});

test("it provides a method for finding all registered components by type key", function() {
  var component1 = { typeKey: 'foo' };
  var component2 = { typeKey: 'foo' };
  var component3 = { typeKey: 'bar' };
  var object = subjectFactory({
    allowedComponents: [ 'foo', 'bar' ]
  });

  object.registerComponent(component1);
  object.registerComponent(component2);
  object.registerComponent(component3);

  deepEqual(object.componentsForType('foo'), [ component1, component2 ], "returns all components of the given type");
});

test("it triggers the `didRegisterComponents` event when the first component is inserted into the DOM", function() {
  var object = subjectFactory({
    didRegisterComponents: function() {
      ok(true, "`didRegisterComponents` event was triggered");
    }
  });

  object.didInsertComponent();
});

test("it maintains a property indicating whether the component has initialized or not", function() {
  expect(3);

  var object = subjectFactory({
    didRegisterComponents: function() {
      strictEqual(object.get('isInitializing'), true, "the component is initializing");
    }
  });

  strictEqual(object.get('isInitializing'), true, "the component is initializing");
  object.didInsertComponent();
  strictEqual(object.get('isInitializing'), false, "the component is not initializing");
});

test("whitelisted component types are inherited", function() {
  var class1 = TestComponent.extend({
    allowedComponents: [ 'foo' ]
  });
  var class2 = class1.extend({
    allowedComponents: [ 'bar' ]
  });
  var object = class2.create();

  deepEqual(object.get('allowedComponents'), [ 'foo',  'bar' ], "`allowedComponets` property is concatenated when inheriting");
});

function subjectFactory(props) {
  props = props || {};
  return TestComponent.create(props);
}