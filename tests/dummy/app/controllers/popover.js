import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    togglePopover: function(num) {
      this.toggleProperty('active' + num);
    }
  }
});