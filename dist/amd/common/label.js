define(
  ["../namespace","../mixin/child","../mixin/active-state","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var ActiveStateMixin = __dependency3__["default"] || __dependency3__;
    var Component = __dependency4__.Component;
    var get = __dependency4__.get;

    var typeKey = 'label';

    /**
      Label Component

      This component acts as a symbol or short description usually for another
      content component.
    */
    __exports__["default"] = Component.extend(ChildComponentMixin, ActiveStateMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      //
      // Internal Properties
      //

      typeKey: typeKey,

      //
      // Event Handlers
      //

      click: function() {
        get(this, 'parent').send('labelFocus', this);
      }
    });
  });