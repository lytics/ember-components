import Ember from 'ember';

const numbers = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen'.split(' ');

export default Ember.Route.extend({
  model: function() {
    return Ember.A(numbers.map(function(number, index) {
      return {
        value: index,
        label: number
      };
    }));
  }
});
