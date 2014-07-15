import ParentComponentMixin from './mixin/parent';
import ChildComponentMixin from './mixin/child';
import OptionComponent from './common/option';
import ButtonComponent from './common/button';
import ContentComponent from './common/content';
import LabelComponent from './common/label';
import CarouselComponent from './display/carousel';
import ToggleComponent from './input/toggle';
import { Application } from 'ember';

Application.initializer({
  name: 'lyticsComponents',
  initialize: function(container, application) {
    application.register('component:lio-option', OptionComponent);
    application.register('component:lio-button', ButtonComponent);
    application.register('component:lio-content', ContentComponent);
    application.register('component:lio-label', ContentComponent);
    application.register('component:lio-carousel', CarouselComponent);
    application.register('component:lio-toggle', ToggleComponent);
  }
});

export {
  ParentComponentMixin,
  ChildComponentMixin,
  OptionComponent,
  ButtonComponent,
  ContentComponent,
  LabelComponent,
  CarouselComponent,
  ToggleComponent
};
