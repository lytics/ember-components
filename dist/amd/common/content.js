define(
  ["../namespace","../mixin/child","../mixin/active-state","../mixin/transition","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var ActiveStateMixin = __dependency3__["default"] || __dependency3__;
    var TransitionMixin = __dependency4__["default"] || __dependency4__;
    var Component = __dependency5__.Component;

    var typeKey = 'content';

    /**
      Content Component

      This component simply wraps a unit of content.
    */
    __exports__["default"] = Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      //
      // Internal Properties
      //

      typeKey: typeKey
    });
  });