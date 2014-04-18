define(
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
  });