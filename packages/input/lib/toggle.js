import { tagForType } from '../namespace';
import ParentComponentMixin from '../mixin/parent';
import {
  Component,
  get,
  set,
  run,
  computed,
  assert
} from 'ember';

var typeKey = 'toggle';

/**
  Toggle Component

  This component switches its value between two options. The possible values
  are taken from the `value` attribute of each option. When the component is
  'toggled', its value is changed to that of the next option.  At any given
  time the option with the value that matches the component's is marked as
  active.

  ```handlebars
  {{#lio-toggle defaultValue=false}}
    {{#lio-option value=true}}Yes{{/lio-option}}
    {{#lio-option value=false}}No{{/lio-option}}
  {{/lio-toggle}}
  ```
*/
export default Component.extend(ParentComponentMixin, {
  typeKey: typeKey,

  tagName: tagForType(typeKey),

  allowedComponents: [ 'option' ],

  classNameBindings: [ 'valueClass', 'disabled' ],

  defaultValue: false,

  value: computed.oneWay('defaultValue'),

  valueClass: function() {
    return '' + get(this, 'value');
  }.property('value'),

  disabled: false,

  actions: {
    toggle: function() {
      if (!get(this, 'disabled')) {
        run(this, function() {
          var current = get(this, 'value');
          var possible = get(this, 'possibleValues');
          var nextIndex = possible.indexOf(current) + 1;

          // Wrap around to the first value
          if (nextIndex === get(possible, 'length')) {
            nextIndex = 0;
          }

          set(this, 'value', possible[nextIndex]);
        });

        this.sendAction('action', get(this, 'value'));
      }
    }
  },

  possibleValues: computed(function() {
    return this.componentsForType('option').mapBy('value');
  }).property('components.[]'),

  click: function() {
    this.send('toggle');
  },

  keyPress: function(event) {
    if (event.which === 13) {
      this.send('toggle');
    }
  },

  verifyDependencies: function() {
    assert("The '" + get(this, 'tagName') + "' component must contain at exactly two 'lio-option' components.", get(this.componentsForType('option'), 'length') === 2);
  }.on('didRegisterComponents')
});
