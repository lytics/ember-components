define(
  ["./mixin/parent","./mixin/child","./mixin/active-state","./mixin/transition","./common/option","./common/button","./common/content","./common/label","./display/carousel","./display/popover","./display/templates/popover","./display/tip","./input/toggle","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __dependency10__, __dependency11__, __dependency12__, __dependency13__, __dependency14__, __exports__) {
    "use strict";
    var ParentComponentMixin = __dependency1__["default"] || __dependency1__;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var ActiveStateMixin = __dependency3__["default"] || __dependency3__;
    var TransitionMixin = __dependency4__["default"] || __dependency4__;
    var OptionComponent = __dependency5__["default"] || __dependency5__;
    var ButtonComponent = __dependency6__["default"] || __dependency6__;
    var ContentComponent = __dependency7__["default"] || __dependency7__;
    var LabelComponent = __dependency8__["default"] || __dependency8__;
    var CarouselComponent = __dependency9__["default"] || __dependency9__;
    var PopoverComponent = __dependency10__["default"] || __dependency10__;
    var PopoverTemplate = __dependency11__["default"] || __dependency11__;
    var TipComponent = __dependency12__["default"] || __dependency12__;
    var ToggleComponent = __dependency13__["default"] || __dependency13__;
    var Application = __dependency14__.Application;

    Application.initializer({
      name: 'lyticsComponents',
      initialize: function(container, application) {
        application.register('component:lio-option', OptionComponent);
        application.register('component:lio-button', ButtonComponent);
        application.register('component:lio-content', ContentComponent);
        application.register('component:lio-label', LabelComponent);
        application.register('component:lio-carousel', CarouselComponent);
        application.register('component:lio-popover', PopoverComponent);
        application.register('template:components/lio-popover', PopoverTemplate);
        application.register('component:lio-tip', TipComponent);
        application.register('component:lio-toggle', ToggleComponent);
      }
    });

    __exports__.ParentComponentMixin = ParentComponentMixin;
    __exports__.ChildComponentMixin = ChildComponentMixin;
    __exports__.ActiveStateMixin = ActiveStateMixin;
    __exports__.TransitionMixin = TransitionMixin;
    __exports__.OptionComponent = OptionComponent;
    __exports__.ButtonComponent = ButtonComponent;
    __exports__.ContentComponent = ContentComponent;
    __exports__.LabelComponent = LabelComponent;
    __exports__.CarouselComponent = CarouselComponent;
    __exports__.ToggleComponent = ToggleComponent;
    __exports__.PopoverComponent = PopoverComponent;
    __exports__.TipComponent = TipComponent;
  });