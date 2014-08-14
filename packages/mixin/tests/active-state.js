(function() {

moduleForComponent('lio-mixin-active-state', 'ActiveStateMixin');

test("the active state defaults to false", function() {
  var component = this.subject({});

  ok(!component.get('active'), "it is not active");
});

test("it has the 'active'/'inactive' classes based on active state", function() {
  var component = buildComponent(this, {});

  ok(!component.$().hasClass('active'), "it does not have the 'active' class");
  ok(component.$().hasClass('inactive'), "it has the 'inactive' class");
  Ember.run(component, 'set', 'active', true);
  ok(component.$().hasClass('active'), "it has the 'active' class");
  ok(!component.$().hasClass('inactive'), "it does not have the 'inactive' class");
});

test("it has the 'active' class immediately after insertion when transitions are enabled", function() {
  var component = buildComponent(this, {
    // The existence of the `withTransition` method indicates transitions are available
    withTransition: function() {},
    active: true
  });

  ok(component.$().hasClass('active'), "it has the 'active' class");
});

test("it adds the 'active' class after transitions are done", function() {
  var callback;
  var component = buildComponent(this, {
    // Stub `withTransition` instead of using transition mixin directly
    withTransition: function(className, fn) {
      callback = fn.bind(this);
    }
  });

  Ember.run(component, 'set', 'active', true);
  ok(!component.$().hasClass('active'), "it does not have the 'active' class");
  Ember.run(callback);
  ok(component.$().hasClass('active'), "it has the 'active' class");
});

})();
