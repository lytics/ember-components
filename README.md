# Lytics Ember Components

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

Install [Test'em](https://github.com/airportyh/testem) globally if needed:

```sh
$ npm install -g testem
```

Build and watch, then test:

```sh
$ broccoli serve --host localhost --port 4200 &
$ testem
```
