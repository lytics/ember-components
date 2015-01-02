import Ember from 'ember';

var numbers = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen'.split(' ');

export default Ember.Route.extend({
  model: function() {
    return Ember.A(numbers.map(function(number, index) {
      return {
        value: index,
        label: number
      };
    }));
  }
})
