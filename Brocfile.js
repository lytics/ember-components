var fs = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var compileModules = require('broccoli-dist-es6-module');
var compileTemplates = require('broccoli-template-compiler');

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

// Find all files at the root directory
var files = fs.readdirSync(srcTree).filter(function(name) {
  return fs.statSync(srcTree + '/' + name).isFile();
});

// Pick out source files at the root
srcTree = pickFiles(srcTree, {
  srcDir: '/',
  files: files,
  destDir: '/',
});

// Merge them all together
srcTree = mergeTrees(packages.concat(srcTree));

// Compile templates
srcTree = compileTemplates(srcTree, {
  module: true
});

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
