"use strict";
var testTrasitionSupport = require("../browser").testTrasitionSupport;
var RSVP = require("ember").RSVP;
var Mixin = require("ember").Mixin;
var A = require("ember").A;
var get = require("ember").get;
var set = require("ember").set;
var run = require("ember").run;
var $ = require("ember").$;

// Test transition support once, then check the exported value in `$.support.transition`
testTrasitionSupport();

exports["default"] = Mixin.create({
  //
  // Handlebars Attributes
  //

  // Any component can override this property to never use transitions,
  // otherwise it defaults to the parent component's value
  disableTransitions: function() {
    return get(this, 'parent.disableTransitions') === true;
  }.property(),

  //
  // Internal Properties
  //

  // Whether the component is in the middle of a transition
  isTransitioning: false,

  // This class gets added in order to trigger the actual transition
  transitionTriggerClass: 'trigger',

  // An optional class that gets added to prime a transition, used internally
  transitionClass: null,

  //
  // Hooks / Observers
  //

  // Normalize the 'transitionend' event by setting up an Ember event to fire
  // when the DOM event fires; this is primarily for testing purposes
  initTransitionEvent: function() {
    var component = this;

    if ($.support.transition) {
      this.$().on($.support.transition.end, function(event) {
        // This code is async and ember-testing requires us to wrap any code
        // with asynchronous side-effects in an Ember.run
        run(component, 'trigger', 'transitionDidEnd');

        // Don't bubble the DOM event and cause other components to receive
        // a false transition end event
        return false;
      });
    }
  }.on('didInsertElement'),

  //
  // Internal Methods
  //

  // Encapsulate a transition; the callback gets run regardless of support
  withTransition: function(transitionClass, callback) {
     // Don't perform transitions if they are not supported, they are explicitly disabled,
     // or the component's parent hasn't finished initializing
     if ($.support.transition && !get(this, 'disableTransitions') && !get(this, 'parent.isInitializing')) {
      var currentTransition = get(this, 'currentTransition');

      // If a transition is currently running, abort it first
      if (currentTransition) {
        currentTransition.abort();
      }

      var transition = new Transition(this, transitionClass);

      set(this, 'currentTransition', transition);

      // Invoke the callback regardless of whether the transition was aborted
      transition.promise['finally'](function() {
        callback && callback.call(this);
        set(this, 'currentTransition', null);
      }.bind(this));
    } else {
      // Don't unleash Zalgo
      // TODO debt: even though this is async in the sense that it doesn't
      // invoke the callback before returning, it is still invoked in the same
      // event loop, unlike transition end events. Unfortunately changing this
      // to use `run.later` has far reaching testing implications
      callback && run(this, callback);
    }
  }
});

// Class for encapsulating a transition
function Transition(component, transitionClass) {
  var deferred = RSVP.defer("Transition: '" + transitionClass + "' on component '" + component + "'");
  var triggerClass = get(component, 'transitionTriggerClass');
  var $el = component.$();
  var handleTrasitionEnd = function() {
    set(component, 'isTransitioning', false);

    // Remove all transition classes
    $el.removeClass(transitionClass + ' ' + triggerClass);

    deferred.resolve();
  };

  this.promise = deferred.promise;

  // Add the component's transition priming class if it exists
  transitionClass = A([ get(component, 'transitionClass'), transitionClass ]).compact().join(' ');

  // Add ability to abort the transition
  this.abort = function() {
    component.off('transitionDidEnd', handleTrasitionEnd);

    // This removes the transition classes which ensures that a transition
    // end event won't be received for the transition
    handleTrasitionEnd();

    deferred.reject();
  };

  // Add the end handler before the transition is started
  component.one('transitionDidEnd', handleTrasitionEnd);

  // Begin transition
  set(component, 'isTransitioning', true);

  // Add transition priming class
  $el.addClass(transitionClass);

  // Force a reflow to interrupt any transitions so the element can be
  // initialized before the real transition
  $el.get(0).offsetWidth;

  // Add class to start the transition
  $el.addClass(triggerClass);
}