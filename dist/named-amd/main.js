define("lytics-components/boolean/false",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;
    var computed = __dependency1__.computed;

    __exports__["default"] = Component.extend({
      tagName: 'boolean-input-false',

      isVisible: computed.not('parentView.value'),

      registerWithParent: function() {

      }.on('didInsertElement')
    });
  });define("lytics-components/boolean/input",
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
            this.toggleProperty('value');
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
  });define("lytics-components/boolean/main",
  ["./input","./true","./false","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var BooleanInputComponent = __dependency1__["default"] || __dependency1__;
    var BooleanInputTrueComponent = __dependency2__["default"] || __dependency2__;
    var BooleanInputFalseComponent = __dependency3__["default"] || __dependency3__;
    var Application = __dependency4__.Application;

    Application.initializer({
      name: 'booleanInputComponent',
      initialize: function(container) {
        container.register('component:boolean-input', BooleanInputComponent);
        container.register('component:boolean-input-true', BooleanInputTrueComponent);
        container.register('component:boolean-input-false', BooleanInputFalseComponent);
      }
    });

    __exports__.BooleanInputComponent = BooleanInputComponent;
    __exports__.BooleanInputTrueComponent = BooleanInputTrueComponent;
    __exports__.BooleanInputFalseComponent = BooleanInputFalseComponent;
  });define("lytics-components/boolean/true",
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
  });define("lytics-components",
  ["./boolean/main","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BooleanInputComponent = __dependency1__.BooleanInputComponent;
    var BooleanInputTrueComponent = __dependency1__.BooleanInputTrueComponent;
    var BooleanInputFalseComponent = __dependency1__.BooleanInputFalseComponent;

    __exports__.BooleanInputComponent = BooleanInputComponent;
    __exports__.BooleanInputTrueComponent = BooleanInputTrueComponent;
    __exports__.BooleanInputFalseComponent = BooleanInputFalseComponent;
  });