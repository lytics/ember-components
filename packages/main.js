import ParentComponentMixin from './mixin/parent';
import ChildComponentMixin from './mixin/child';
import ActiveStateMixin from './mixin/active-state';
import TransitionMixin from './mixin/transition';
import OptionComponent from './common/option';
import ButtonComponent from './common/button';
import ContentComponent from './common/content';
import LabelComponent from './common/label';
import TextFieldComponent from './common/text-field';
import FilterComponent from './common/filter';
import CarouselComponent from './display/carousel';
import PopoverComponent from './display/popover';
import PopoverTemplate from './display/templates/popover';
import TipComponent from './display/tip';
import ToggleComponent from './input/toggle';
import MultiSelectComponent from './input/multi-select';
import { Application } from 'ember';

Application.initializer({
  name: 'lyticsComponents',
  initialize: function(container, application) {
    application.register('component:lio-option', OptionComponent);
    application.register('component:lio-button', ButtonComponent);
    application.register('component:lio-content', ContentComponent);
    application.register('component:lio-label', LabelComponent);
    application.register('component:lio-text-field', TextFieldComponent);
    application.register('component:lio-filter', FilterComponent);
    application.register('component:lio-carousel', CarouselComponent);
    application.register('component:lio-popover', PopoverComponent);
    application.register('template:components/lio-popover', PopoverTemplate);
    application.register('component:lio-tip', TipComponent);
    application.register('component:lio-toggle', ToggleComponent);
    application.register('component:lio-multi-select', MultiSelectComponent);
  }
});

export {
  ParentComponentMixin,
  ChildComponentMixin,
  ActiveStateMixin,
  TransitionMixin,
  OptionComponent,
  ButtonComponent,
  ContentComponent,
  LabelComponent,
  TextFieldComponent,
  FilterComponent,
  CarouselComponent,
  PopoverComponent,
  TipComponent,
  ToggleComponent,
  MultiSelectComponent
};
