define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;
    var computed = __dependency1__.computed;

    __exports__["default"] = Component.extend({
      tagName: 'boolean-input-true',

      isVisible: computed.alias('parentView.value'),

      registerWithParent: function() {

      }.on('didInsertElement')
    });
  });