import Ember from 'ember';

export default Ember.ArrayController.extend({
  setValues: Ember.observer('model', function() {
    var randomModels = this.get('model').filter(function() {
      return Math.random() < 0.25;
    });
    var values = Ember.A(randomModels).mapBy('value');

    this.set('values', Ember.A(values));
  })
});