var fs = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
// var compileTemplates = require('broccoli-template');
var compileModules = require('broccoli-dist-es6-module');

// Source files are located in the 'package' directory
var srcTree = 'packages';

// Find all package names
var packages = fs.readdirSync(srcTree).filter(function(name) {
  return fs.statSync(srcTree + '/' + name).isDirectory();
});

// Create a tree for each package that only uses files in the 'lib' subdirectory
packages = packages.map(function(name) {
  return pickFiles(srcTree + '/' + name, {
    srcDir: '/lib',
    destDir: '/' + name,
  });
});

// Pick out the 'main.js' entry point file
srcTree = pickFiles(srcTree, {
  srcDir: '/',
  files: [ 'main.js' ],
  destDir: '/',
});

// Merge them all together
srcTree = mergeTrees(packages.concat(srcTree));

// Compile templates
// srcTree = compileTemplates(srcTree, {
//   extensions: [ 'hbs' ],
//   compileFunction: 'Ember.Handlebars.compile',
// });

// Compile modules into different formats
var moduleTree = compileModules(srcTree, {
  global: 'Lytics.Components',
  packageName: 'lytics-components',
  main: 'main',
  shim: {
    'ember': 'Ember'
  }
});

module.exports = mergeTrees([ moduleTree ]);
