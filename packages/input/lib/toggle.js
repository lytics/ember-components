import namespace from '../namespace';
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

export default Component.extend(ParentComponentMixin, {
  typeKey: typeKey,

  tagName: namespace + '-' + typeKey,

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
        assert("The '" + get(this, 'tagName') + "' component must contain at least two '" + namespace + '-' + get(this, 'allowedComponents')[0] + "' component in order to toggle", get(this.componentsForType(get(this, 'allowedComponents')[0]), 'length'));

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
  }
});
