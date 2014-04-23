moduleForComponent('boolean-input', 'BooleanInputComponent', {
  needs: [
    'component:boolean-input-true',
    'component:boolean-input-false',
  ]
});

var template1 = compileTemplate(function() {/*
  {{#boolean-input-true class="true"}}Aaaaaay{{/boolean-input-true}}
  {{#boolean-input-false class="false"}}Awwwwww{{/boolean-input-false}}
*/});

test("clicking the component toggles the value attribute", function() {
  var component = buildComponent(this);

  Ember.run(component, 'set', 'value', false);
  equal(component.get('value'), false, "value is false before click");
  component.$().simulate('click');
  equal(component.get('value'), true, "value is true after click");
});

test("pressing enter when the component is focused toggles the value attribute", function() {
  var component = buildComponent(this);

  Ember.run(component, 'set', 'value', false);
  equal(component.get('value'), false, "value is false before keypress");
  component.$().simulate('keypress', { keyCode: $.simulate.keyCode.ESCAPE });
  equal(component.get('value'), false, "value is false after bad keypress");
  component.$().simulate('keypress', { keyCode: $.simulate.keyCode.ENTER });
  equal(component.get('value'), true, "value is true after keypress");
});

test("clicking or pressing enter does nothing when disabled attribute is true", function() {
  var component = buildComponent(this);

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
    contextObject: contextObject,
    valueBinding: 'contextObject.value',
    action: 'action',
    targetObject: targetObject
  });

  component.$().simulate('click');
});

test("component has the correct class based on disabled value", function() {
  var component = buildComponent(this);

  Ember.run(component, 'set', 'disabled', false);
  ok(!component.$().hasClass('disabled'), "does not have 'disabled' class when disabled is false");
  Ember.run(component, 'set', 'disabled', true);
  ok(component.$().hasClass('disabled'), "has 'disabled' class when disabled is true");
});

test("component has the correct class based on the value", function() {
  var component = buildComponent(this);

  Ember.run(component, 'set', 'value', false);
  ok(component.$().hasClass('false'), "has 'false' class when value is false");
  Ember.run(component, 'set', 'value', true);
  ok(component.$().hasClass('true'), "has 'true' class when value is true");
});

test("components have correct tag names", function() {
  var component = buildComponent(this, {
    template: template1
  });

  equal(tagNameFor(component), 'boolean-input', "true component has 'boolean-input-true' class");
  equal(tagNameFor(component, '.true'), 'boolean-input-true', "true component has 'boolean-input-true' class");
  equal(tagNameFor(component, '.false'), 'boolean-input-false', "false component has 'boolean-input-false' class");
});

test("true/false sub-components are hidden/shown properly, have correct classes", function() {
  var component = buildComponent(this, {
    template: template1
  });

  Ember.run(component, 'set', 'value', false);
  ok(component.$('.true').is(':hidden'), "true component is hidden when value is false");
  ok(component.$('.false').is(':visible'), "false component is visible when value is false");
  Ember.run(component, 'set', 'value', true);
  ok(component.$('.true').is(':visible'), "true component is visible when value is false");
  ok(component.$('.false').is(':hidden'), "false component is hidden when value is false");
});
