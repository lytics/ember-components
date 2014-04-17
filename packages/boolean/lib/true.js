import { Component, computed } from 'ember';

export default Component.extend({
  tagName: 'boolean-input-true',

  isVisible: computed.alias('parentView.value'),

  registerWithParent: function() {

  }.on('didInsertElement')
});
