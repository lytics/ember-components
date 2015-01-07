# Lytics Ember Components

![TravisCI](https://travis-ci.org/lytics/ember-components.svg?branch=travis-support)

This is a collection of generic input components used by Lytics Inc.

## Include it in your project

```sh
$ npm install --save-dev lytics-ember-components
```

And that's it! Assuming you are using ember-cli.

At this point you can use the components in templates like this

```handlebars
{{#lio-tip}}
  {{#lio-label}}A tip{{/lio-label}}
  {{#lio-popover}}
    The rollover part
  {{/lio-popover}}
{{/lio-tip}}
```

Or you can extend the components like this

```js
import TipComponent from 'lytics-ember-components/components/lio-tip';

export default TipComponent.extend({
  // things!
});
```

## What if I'm not using ember-cli?

Version `0.2.x` uses a more welcoming build, and it is available on Bower.

```sh
$ bower install lytics-ember-components
```


## Contributing

This is an [Ember CLI](http://www.ember-cli.com/) project. As such, it is built and managed in the Ember CLI fashion.

Serve with `ember serve`

Test with `ember test`

## View Examples

1. Serve with `ember serve`
2. Visit [http://localhost:4200](http://localhost:4200) for a directory