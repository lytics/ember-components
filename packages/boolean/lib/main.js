import BooleanInputComponent from './input';
import BooleanInputTrueComponent from './true';
import BooleanInputFalseComponent from './false';
import { Application } from 'ember';

Application.initializer({
  name: 'booleanInputComponent',
  initialize: function(container) {
    container.register('component:boolean-input', BooleanInputComponent);
    container.register('component:boolean-input-true', BooleanInputTrueComponent);
    container.register('component:boolean-input-false', BooleanInputFalseComponent);
  }
});

export {
  BooleanInputComponent,
  BooleanInputTrueComponent,
  BooleanInputFalseComponent
};
