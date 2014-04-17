import { Component } from 'ember';

export default Component.extend({
  tagName: 'boolean-input',

  classNameBindings: [ 'value:true:false', 'disabled' ],

  value: null,

  disabled: false,

  actions: {
    toggle: function() {
      if (!this.get('disabled')) {
        this.toggleProperty('value');
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
