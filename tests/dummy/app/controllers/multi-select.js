import Ember from 'ember';

export default Ember.ArrayController.extend({
  setValues: Ember.observer('model', function() {
    const randomModels = this.get('model').filter(function() {
      return Math.random() < 0.25;
    });
    const values = Ember.A(randomModels).mapBy('value');

    this.set('values', Ember.A(values));
  })
});
