import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('carousel');
  this.route('multi-select');
  this.route('popover');
  this.route('tip');
  this.route('toggle');
});

export default Router;
