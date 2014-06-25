import { Component } from 'ember';

export default Component.extend({
  tagName: 'boolean-input',

  classNameBindings: [ 'value:true:false', 'disabled' ],

  // Ensure that the value is always a boolean
  // Returns the value when the computed property is cached.
  // Returns false when the cache is empty
  value: function(key, value) {
    return arguments.length === 1 ? false : !!value;
  }.property(),

  disabled: false,

  actions: {
    toggle: function() {
      if (!this.get('disabled')) {
        Ember.run(this, 'toggleProperty', 'value');
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
