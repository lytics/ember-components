import ParentComponentMixin from './mixin/parent';
import ChildComponentMixin from './mixin/child';
import OptionComponent from './common/option';
import ToggleComponent from './input/toggle';
import { Application } from 'ember';

Application.initializer({
  name: 'lyticsComponents',
  initialize: function(container, application) {
    application.register('component:lio-option', OptionComponent);
    application.register('component:lio-toggle', ToggleComponent);
  }
});

export {
  ParentComponentMixin,
  ChildComponentMixin,
  OptionComponent,
  ToggleComponent
};
