# Lytics Ember Components

![TravisCI](https://travis-ci.org/lytics/ember-components.svg?branch=travis-support)

This is a collection of generic input components used by Lytics Inc.

## Building

Install [Broccoli](https://github.com/joliss/broccoli) globally if needed:

```sh
$ npm install -g broccoli-cli
```

Build to the `dist/` directory:

```sh
$ npm install
$ rm -rf dist
$ broccoli build dist
```

## Testing

Install [Test'em](https://github.com/airportyh/testem) and [Broccoli Timepiece](https://github.com/rjackson/broccoli-timepiece) globally if needed:

```sh
$ npm install -g testem broccoli-timepiece
```

Build and watch, then test:

```sh
$ broccoli-timepiece dist
$ testem
```
