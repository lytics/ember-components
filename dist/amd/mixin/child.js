define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Mixin = __dependency1__.Mixin;
    var EmberArray = __dependency1__.A;
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;
    var assert = __dependency1__.assert;

    __exports__["default"] = Mixin.create({
      //
      // Internal Properties
      //

      parent: computed.alias('parentView'),

      //
      // Hooks / Observers
      //

      registerWithParent: function() {
        var parent = get(this, 'parent');

        if (!get(this, 'canBeTopLevel')) {
          assert("The '" + get(this, 'tagName') + "' component must be nested underneath another component'", parent && parent.registerComponent);
        }

        parent && parent.registerComponent && parent.registerComponent(this);
      }.on('willInsertElement'),

      notifyParent: function() {
        var parent = get(this, 'parent');
        parent && parent.didInsertComponent && parent.didInsertComponent(this);
      }.on('didInsertElement')
    });
  });