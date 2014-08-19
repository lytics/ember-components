define(
  ["../namespace","../mixin/child","../mixin/active-state","../mixin/transition","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var ActiveStateMixin = __dependency3__["default"] || __dependency3__;
    var TransitionMixin = __dependency4__["default"] || __dependency4__;
    var Component = __dependency5__.Component;
    var get = __dependency5__.get;
    var computed = __dependency5__.computed;

    var typeKey = 'option';

    /**
      Option Component

      This component represents an option that the user can choose from. The value
      of the option is set through its `value` attribute, which a string
      representation of is set as a class.
    */
    __exports__["default"] = Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      classNameBindings: [ 'valueClass' ],

      //
      // Internal Properties
      //

      typeKey: typeKey,

      valueClass: function() {
        return '' + get(this, 'value');
      }.property('value'),

      // Override the active state mixin's property to use the parent's value
      isActive: computed(function() {
        return get(this, 'value') === get(this, 'parent.value');
      }).property('value', 'parent.value')
    });
  });