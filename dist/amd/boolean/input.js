define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;

    __exports__["default"] = Component.extend({
      tagName: 'boolean-input',

      classNameBindings: [ 'value:true:false', 'disabled' ],

      value: null,

      disabled: false,

      actions: {
        toggle: function() {
          if (!this.get('disabled')) {
            Ember.run(this, 'toggleProperty', 'value');
            this.sendAction('action', this.get('value'));
          }
        }
      },

      click: function() {
        this.send('toggle');
      },

      keyPress: function(event) {
        if (event.which === 13) {
          this.send('toggle');
        }
      }
    });
  });