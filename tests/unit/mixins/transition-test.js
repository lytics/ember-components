import Ember from "ember";
import TransitionMixin from 'lytics-ember-components/mixins/transition';
import {
  test
} from 'ember-qunit';
import {
  mockGlobalPath
} from '../../helpers/mock-path';

module('TransitionMixin');

const TestComponent = Ember.Component.extend(TransitionMixin);

test("transitions are enabled by default when transitions are supported", function() {
  mockGlobalPath('$.support.transition', { end: 'testEvent' }, this, function() {
    const component = subjectFactory();

    ok(!component.get('disableTransitions'), "transitions are enabled");
  });
});

test("transitions are disabled by default when the parent component disables transitions", function() {
  mockGlobalPath('$.support.transition', { end: 'testEvent' }, this, function() {
    const component = subjectFactory({
      parent: {
        disableTransitions: true
      }
    });

    ok(component.get('disableTransitions'), "transitions are disabled");
  });
});

test("the transition end event is not bubbled", function() {
  // Override transition support object to test correct event is used
  mockGlobalPath('$.support.transition', { end: 'testEvent' }, this, function() {
    const component = subjectFactory();

    component.$().on($.support.transition.end, function(event) {
      ok(event.isPropagationStopped(), "the transition end event bubbled");
    });

    component.$().trigger($.Event($.support.transition.end));
  });
});

test("it fires an Ember event on transition end", function() {
  expect(1);

  // Override transition support object to test correct event is used
  const oldSupport = $.support.transition;
  $.support.transition = { end: 'testEvent' };

  const component = subjectFactory();

  component.one('transitionDidEnd', function() {
    ok(true, "`transitionDidEnd` event was triggered");
  });

  component.$().trigger($.support.transition.end);

  // Restore old transition support
  $.support.transition = oldSupport;
});

test("priming, transition, and trigger classes are added/removed when transitions are enabled", function() {
  const component = subjectFactory({
    transitionTriggerClass: 'trigger-class',
    transitionClass: 'transition-class'
  });

  component.withTransition('priming-class');

  ok(component.$().hasClass('priming-class'), 'the priming class was added');
  ok(component.$().hasClass('transition-class'), 'the transition class was added');
  ok(component.$().hasClass('trigger-class'), 'the trigger class was added');
  Ember.run(component, 'trigger', 'transitionDidEnd');
  ok(!component.$().hasClass('priming-class'), 'the priming class was removed');
  ok(!component.$().hasClass('transition-class'), 'the transition class was removed');
  ok(!component.$().hasClass('trigger-class'), 'the trigger class was removed');
});

test("the after transition callback is invoked when transitions are enabled", function() {
  expect(1);

  const component = subjectFactory();

  component.withTransition('test', function() {
    ok(true, "the always callback was invoked");
  });
  Ember.run(component, 'trigger', 'transitionDidEnd');
});

test("the after transition callback is invoked when transitions are disabled", function() {
  expect(1);

  const component = subjectFactory({
    disableTransitions: true,
  });

  component.withTransition('test', function() {
    ok(true, "the callback was invoked");
  });
});

test("transition classes are not added when transitions are disabled", function() {
  expect(3);

  const component = subjectFactory({
    disableTransitions: true,
  });

  component.withTransition('test');

  ok(!component.$().hasClass('priming-class'), 'the priming class was not added');
  ok(!component.$().hasClass('transition-class'), 'the transition class was not added');
  ok(!component.$().hasClass('trigger-class'), 'the trigger class was not added');
});

test("transition classes are note added when the parent component has not finished initializing", function() {
  expect(3);

  const component = subjectFactory({
    parent: {
      isInitializing: false
    }
  });

  component.withTransition('test');

  ok(!component.$().hasClass('priming-class'), 'the priming class was not added');
  ok(!component.$().hasClass('transition-class'), 'the transition class was not added');
  ok(!component.$().hasClass('trigger-class'), 'the trigger class was not added');
});

test("a property reports whether a transition is happening or not", function () {
  expect(2);

  const component = subjectFactory();

  component.withTransition('test', function() {
    equal(component.get('isTransitioning'), false, "the component reports it is not transitioning");
  });

  equal(component.get('isTransitioning'), true, "the component reports it is transitioning");
  Ember.run(component, 'trigger', 'transitionDidEnd');
});

function subjectFactory(props) {
  props = props || {};
  const component = TestComponent.create(props);

  Ember.run(function() {
    component.appendTo('#ember-testing');
  });

  return component;
}
