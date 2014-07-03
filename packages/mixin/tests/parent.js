moduleFor('mixin:lio-parent-component', 'ParentComponentMixin', {
  subject: function(factory, options) {
    return Ember.Component.createWithMixins(factory, options);
  }
});

test("it does not allow components without a type key to register themselves", function() {
  var component = {};
  var object = this.subject({
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
  var object = this.subject({
    tagName: 'lio-foo',
    allowedComponents: [ 'foo' ]
  });

  throws(function() {
    object.registerComponent(component);
  }, /A 'lio-bar' component cannot be nested within a 'lio-foo' component./);
});

test("it allows whitelisted child components to register themselves", function() {
  var component = { typeKey: 'foo' };
  var object = this.subject({
    allowedComponents: [ 'foo' ]
  });

  ok(typeof object.registerComponent, 'function', "has `registerComponent` method");

  object.registerComponent(component);
  ok(true, 'whitelisted components can be registered');
});

test("it maintains an array of all registered components", function() {
  var component1 = { typeKey: 'foo' };
  var component2 = { typeKey: 'foo' };
  var object = this.subject({
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
  var object = this.subject({
    allowedComponents: [ 'foo', 'bar' ]
  });

  object.registerComponent(component1);
  object.registerComponent(component2);
  object.registerComponent(component3);

  deepEqual(object.componentsForType('foo'), [ component1, component2 ], "returns all components of the given type");
});

test("whitelisted component types are inherited", function() {
  var class1 = Ember.Component.extend(this.factory(), {
    allowedComponents: [ 'foo' ]
  });
  var class2 = class1.extend({
    allowedComponents: [ 'bar' ]
  });
  var object = class2.create();

  deepEqual(object.get('allowedComponents'), [ 'foo',  'bar' ], "`allowedComponets` property is concatenated when inheriting");
});
