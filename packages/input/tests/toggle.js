(function() {

moduleForComponent('lio-toggle', 'ToggleComponent', {
  needs: [
    'component:lio-option',
  ]
});

var template1 = compileTemplate(function() {/*
  {{#lio-option value=true}}Aaaaaay{{/lio-option}}
  {{#lio-option value=false}}Awwwwww{{/lio-option}}
*/});

test("component has correct tag name", function() {
  var component = buildComponent(this, { template: template1 });

  equal(tagNameFor(component), 'lio-toggle', "component has 'lio-toggle' tag");
});

test("clicking the component toggles the value attribute", function() {
  var component = buildComponent(this, { template: template1 });

  Ember.run(component, 'set', 'value', false);
  equal(component.get('value'), false, "value is false before click");
  component.$().simulate('click');
  equal(component.get('value'), true, "value is true after click");
});

test("pressing enter when the component is focused toggles the value attribute", function() {
  var component = buildComponent(this, { template: template1 });

  Ember.run(component, 'set', 'value', false);
  equal(component.get('value'), false, "value is false before keypress");
  component.$().simulate('keypress', { keyCode: $.simulate.keyCode.ESCAPE });
  equal(component.get('value'), false, "value is false after bad keypress");
  component.$().simulate('keypress', { keyCode: $.simulate.keyCode.ENTER });
  equal(component.get('value'), true, "value is true after keypress");
});

test("clicking or pressing enter does nothing when disabled attribute is true", function() {
  var component = buildComponent(this, { template: template1 });

  Ember.run(component, 'set', 'value', false);
  Ember.run(component, 'set', 'disabled', true);
  component.$().simulate('click');
  equal(component.get('value'), false, "value is still false after click");
  component.$().simulate('keypress', { keyCode: $.simulate.keyCode.ENTER });
  equal(component.get('value'), false, "value is still false after keypress");
});

test("clicking or pressing enter triggers the component's default action", function() {
  expect(2);

  var contextObject = Ember.Object.create({
    value: false
  });

  var targetObject = {
    action: function(value) {
      equal(value, true, "default action was triggered with the new value");
      equal(contextObject.get('value'), true, "the value was toggled in its in its own run loop");
    }
  };

  var component = buildComponent(this, {
    template: template1,
    contextObject: contextObject,
    valueBinding: 'contextObject.value',
    action: 'action',
    targetObject: targetObject
  });

  component.$().simulate('click');
});

test("the value defaults to the `defaultValue` attribute", function() {
  var component = buildComponent(this, {
    defaultValue: true,
    template: template1
  });

  equal(component.get('value'), true, "value is initially set to default");
});

test("component has the correct class based on disabled value", function() {
  var component = buildComponent(this, { template: template1 });

  Ember.run(component, 'set', 'disabled', false);
  ok(!component.$().hasClass('disabled'), "does not have 'disabled' class when disabled is false");
  Ember.run(component, 'set', 'disabled', true);
  ok(component.$().hasClass('disabled'), "has 'disabled' class when disabled is true");
});

test("component has the correct class based on the value", function() {
  var component = buildComponent(this, { template: template1 });

  Ember.run(component, 'set', 'value', false);
  ok(component.$().hasClass('false'), "has 'false' class when value is false");
  Ember.run(component, 'set', 'value', true);
  ok(component.$().hasClass('true'), "has 'true' class when value is true");
});

test("true/false sub-components have correct classes", function() {
  var component = buildComponent(this, { template: template1 });

  Ember.run(component, 'set', 'value', false);
  ok(!component.$('.true').hasClass('active'), "true component does not have 'active' class when value is false");
  ok(component.$('.false').hasClass('active'), "false component has 'active' class when value is false");
  Ember.run(component, 'set', 'value', true);
  ok(component.$('.true').hasClass('active'), "true component has 'active' class when value is false");
  ok(!component.$('.false').hasClass('active'), "false component does not have 'active' class when value is false");
});

test("there must be exactly two option components", function() {
  var context = this;

  this.subject({
    template: compileTemplate(function() {/*
      {{#lio-option value=true}}Womp womp{{/lio-option}}
    */})
  });

  throws(function() {
    context.append();
  }, /The 'lio-toggle' component must contain at exactly two 'lio-option' components./);
});

})();