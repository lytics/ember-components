(function() {

moduleFor('mixin:lio-child-component', 'ChildComponentMixin', {
  subject: function(factory, options) {
    return Ember.Component.createWithMixins(factory, options);
  }
});

test("it registers itself with its parent component before being inserted into the DOM", function() {
  var component = this.subject({
    parent: {
      registerComponent: function(object) {
        equal(component, object, '`registerComponent` called on parent component');
      }
    }
  });

  component.trigger('willInsertElement');
});

test("it notifies its parent component after being inserted into the DOM", function() {
  var component = this.subject({
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
  var component = this.subject({
    parentView: parent
  });

  equal(component.get('parent'), parent, '`parent` property is alias for `parentView`');
});

})();