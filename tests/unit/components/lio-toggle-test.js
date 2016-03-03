import Ember from "ember";
import {
  test,
  moduleForComponent
} from 'ember-qunit';
import {
  skip,
} from 'qunit';
import compileTemplate from '../../helpers/compile-template';
import tagNameFor from '../../helpers/tag-name-for';
import {
  mockGlobalPath
} from '../../helpers/mock-path';

moduleForComponent('lio-toggle', 'ToggleComponent', {
  needs: [
    'component:lio-option',
  ]
});

const template1 = compileTemplate(function() {/*
  {{#lio-option value=true}}Aaaaaay{{/lio-option}}
  {{#lio-option value=false}}Awwwwww{{/lio-option}}
*/});

test("component has correct tag name", function() {
  const component = this.subject({ layout: template1 });

  equal(tagNameFor(this), 'lio-toggle', "component has 'lio-toggle' tag");
});

test("clicking the component toggles the value attribute", function() {
  const component = this.subject({ layout: template1 });

  Ember.run(component, 'set', 'value', false);
  equal(component.get('value'), false, "value is false before click");
  this.$().simulate('click');
  equal(component.get('value'), true, "value is true after click");
});

test("pressing enter when the component is focused toggles the value attribute", function() {
  const component = this.subject({ layout: template1 });

  Ember.run(component, 'set', 'value', false);
  equal(component.get('value'), false, "value is false before keypress");
  this.$().simulate('keypress', { keyCode: $.simulate.keyCode.ESCAPE });
  equal(component.get('value'), false, "value is false after bad keypress");
  this.$().simulate('keypress', { keyCode: $.simulate.keyCode.ENTER });
  equal(component.get('value'), true, "value is true after keypress");
});

test("clicking or pressing enter does nothing when disabled attribute is true", function() {
  const component = this.subject({ layout: template1 });

  Ember.run(component, 'set', 'value', false);
  Ember.run(component, 'set', 'disabled', true);
  this.$().simulate('click');
  equal(component.get('value'), false, "value is still false after click");
  this.$().simulate('keypress', { keyCode: $.simulate.keyCode.ENTER });
  equal(component.get('value'), false, "value is still false after keypress");
});

test("clicking or pressing enter triggers the component's default action", function() {
  expect(2);

  const contextObject = Ember.Object.create({
    value: false
  });

  const targetObject = {
    action: function(value) {
      equal(value, true, "default action was triggered with the new value");
      equal(contextObject.get('value'), true, "the value was toggled in its in its own run loop");
    }
  };

  const component = this.subject({
    layout: template1,
    contextObject: contextObject,
    valueBinding: 'contextObject.value',
    action: 'action',
    targetObject: targetObject
  });

  this.$().simulate('click');
});

test("the value is set to the default to the `defaultValue` attribute", function() {
  const contextObject = Ember.Object.create();

  const component = this.subject({
    layout: template1,
    contextObject: contextObject,
    valueBinding: 'contextObject.value',
    defaultValue: true,
  });

  this.$();

  equal(contextObject.get('value'), true, "value is initially set to the default");
});

test("the value is not set to the default to the `defaultValue` attribute when it already has a value", function() {
  const contextObject = Ember.Object.create({
    value: false
  });

  const component = this.subject({
    layout: template1,
    contextObject: contextObject,
    valueBinding: 'contextObject.value',
    defaultValue: true,
  });

  equal(contextObject.get('value'), false, "value is not set to the default");
});

test("the value defaults to the `defaultValue` attribute when there is not value binding", function() {
  const component = this.subject({
    defaultValue: true,
    layout: template1
  });

  equal(component.get('value'), true, "value is initially set to default");
});

test("component has the correct class based on disabled value", function() {
  const component = this.subject({ layout: template1 });

  Ember.run(component, 'set', 'disabled', false);
  ok(!this.$().hasClass('disabled'), "does not have 'disabled' class when disabled is false");
  Ember.run(component, 'set', 'disabled', true);
  ok(this.$().hasClass('disabled'), "has 'disabled' class when disabled is true");
});

test("component has the correct class based on the value", function() {
  const component = this.subject({ layout: template1 });

  Ember.run(component, 'set', 'value', false);
  ok(this.$().hasClass('false'), "has 'false' class when value is false");
  Ember.run(component, 'set', 'value', true);
  ok(this.$().hasClass('true'), "has 'true' class when value is true");
});

test("sub-components have correct classes", function() {
  const component = this.subject({
    layout: template1,
    disableTransitions: true
  });

  Ember.run(component, 'set', 'value', false);
  ok(!this.$().find('.true').hasClass('active'), "true component does not have 'active' class when value is false");
  ok(this.$().find('.false').hasClass('active'), "false component has 'active' class when value is false");
  Ember.run(component, 'set', 'value', true);
  ok(this.$().find('.true').hasClass('active'), "true component has 'active' class when value is false");
  ok(!this.$().find('.false').hasClass('active'), "false component does not have 'active' class when value is false");
});

test("there must be exactly two option components", function() {
  const context = this;

  this.subject({
    layout: compileTemplate(function() {/*
      {{#lio-option value=true}}Womp womp{{/lio-option}}
    */})
  });

  throws(function() {
    context.render();
  }, /The 'lio-toggle' component must contain at exactly two 'lio-option' components./);
});

// TODO: Implement a way to test that classes are properly added and removed during transitions.
// These tests were written when the transition was triggered in a call back and timing could be controlled.
skip("transition classes are added when toggling", function() {
  mockGlobalPath('$.support.transition', { end: 'testEvent' }, this, function() {
    const component = this.subject({
      value: true,
      layout: template1
    });

    this.$();

    const triggerTransitionEnd = function() {
      component.componentsForType('option').invoke('trigger', 'transitionDidEnd');
    };

    Ember.run(component, 'send', 'toggle');
    ok(this.$().find('lio-option:nth-of-type(1)').hasClass('deactivating'), "the first option has the 'deactivating' class");
    ok(this.$().find('lio-option:nth-of-type(2)').hasClass('activating'), "the second option has the 'activating' class");
    ok(this.$().find('lio-option:nth-of-type(1)').hasClass('active'), "the first option has the 'active' class");
    ok(!this.$().find('lio-option:nth-of-type(2)').hasClass('active'), "the second option does not have the 'active' class");
    Ember.run(triggerTransitionEnd);
    ok(!this.$().find('lio-option:nth-of-type(1)').hasClass('deactivating'), "the first option does not have the 'deactivating' class");
    ok(!this.$().find('lio-option:nth-of-type(2)').hasClass('activating'), "the second option does not have the 'activating' class");
    ok(!this.$().find('lio-option:nth-of-type(1)').hasClass('active'), "the first option does not have the 'active' class");
    ok(this.$().find('lio-option:nth-of-type(2)').hasClass('active'), "the second option has the 'active' class");
    Ember.run(component, 'send', 'toggle');
    ok(this.$().find('lio-option:nth-of-type(1)').hasClass('activating'), "the first option has the 'activating' class");
    ok(this.$().find('lio-option:nth-of-type(2)').hasClass('deactivating'), "the second option has the 'deactivating' class");
    ok(!this.$().find('lio-option:nth-of-type(1)').hasClass('active'), "the first option does not have the 'active' class");
    ok(this.$().find('lio-option:nth-of-type(2)').hasClass('active'), "the second option has the 'active' class");
    Ember.run(triggerTransitionEnd);
    ok(!this.$().find('lio-option:nth-of-type(1)').hasClass('activating'), "the first option does not have the 'activating' class");
    ok(!this.$().find('lio-option:nth-of-type(2)').hasClass('deactivating'), "the second option does not have the 'deactivating' class");
    ok(this.$().find('lio-option:nth-of-type(1)').hasClass('active'), "the first option has the 'active' class");
    ok(!this.$().find('lio-option:nth-of-type(2)').hasClass('active'), "the second option does not have the 'active' class");
  });
});
