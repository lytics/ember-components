/*jshint node:true*/
/* global require, module */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  const app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  app.import('vendor/jquery.simulate.js');
  app.import('vendor/phantom-shims.js');
  app.import('bower_components/ember/ember-template-compiler.js');

  return app.toTree();
};

