"use strict";
var ParentComponentMixin = require("./mixin/parent")["default"] || require("./mixin/parent");
var ChildComponentMixin = require("./mixin/child")["default"] || require("./mixin/child");
var ActiveStateMixin = require("./mixin/active-state")["default"] || require("./mixin/active-state");
var TransitionMixin = require("./mixin/transition")["default"] || require("./mixin/transition");
var OptionComponent = require("./common/option")["default"] || require("./common/option");
var ButtonComponent = require("./common/button")["default"] || require("./common/button");
var ContentComponent = require("./common/content")["default"] || require("./common/content");
var LabelComponent = require("./common/label")["default"] || require("./common/label");
var CarouselComponent = require("./display/carousel")["default"] || require("./display/carousel");
var PopoverComponent = require("./display/popover")["default"] || require("./display/popover");
var PopoverTemplate = require("./display/templates/popover")["default"] || require("./display/templates/popover");
var TipComponent = require("./display/tip")["default"] || require("./display/tip");
var ToggleComponent = require("./input/toggle")["default"] || require("./input/toggle");
var Application = require("ember").Application;

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

exports.ParentComponentMixin = ParentComponentMixin;
exports.ChildComponentMixin = ChildComponentMixin;
exports.ActiveStateMixin = ActiveStateMixin;
exports.TransitionMixin = TransitionMixin;
exports.OptionComponent = OptionComponent;
exports.ButtonComponent = ButtonComponent;
exports.ContentComponent = ContentComponent;
exports.LabelComponent = LabelComponent;
exports.CarouselComponent = CarouselComponent;
exports.ToggleComponent = ToggleComponent;
exports.PopoverComponent = PopoverComponent;
exports.TipComponent = TipComponent;