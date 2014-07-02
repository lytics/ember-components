import { Component, computed } from 'ember';

export default Component.extend({
  tagName: 'lio-option',

  classNameBindings: [ 'valueClass', 'isActive:active' ],

  valueClass: function() {
    return '' + this.get('value');
  }.property('value'),

  isActive: computed(function() {
    return this.get('value') === this.get('parentView.value');
  }).property('value', 'parentView.value')
});
