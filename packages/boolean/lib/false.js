import { Component, computed } from 'ember';

export default Component.extend({
  tagName: 'boolean-input-false',

  isVisible: computed.not('parentView.value'),

  registerWithParent: function() {

  }.on('didInsertElement')
});
