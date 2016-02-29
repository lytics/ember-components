import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import capitalizeHelper from './helpers/capitalize';

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.Handlebars.registerBoundHelper('capitalize', capitalizeHelper);

const App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
