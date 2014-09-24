define(
  ["../namespace","../mixin/child","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var TextField = __dependency3__.TextField;

    var typeKey = 'text-field';

    /**
      Text Field Component

      This component is a thin wrapper around Ember's `TextField` component that
      registers itself with its parent component.
    */
    __exports__["default"] = TextField.extend(ChildComponentMixin, {
      //
      // Internal Properties
      //

      typeKey: typeKey
    });
  });