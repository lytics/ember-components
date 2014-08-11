emq.globalize();

setResolver(Ember.DefaultResolver.extend({
  testSubjects: Object.keys(Lytics.Components).reduce(function(result, key) {
    var shortName, factory;

    [ 'component', 'mixin', 'template' ].forEach(function(type) {
      if (key.indexOf(type.capitalize()) !== -1) {
        shortName = key.replace(type.capitalize(), '').dasherize();

        factory = result[prefix(type) + shortName] = Lytics.Components[key];

        // Create an additional component factory with the mixins included so that
        // they can be tested with `moduleForComponent`
        if (type === 'mixin') {
          result[prefix('component') + 'mixin-' + shortName] = Ember.Component.extend(factory);
        }
      }
    });

    function prefix(type) {
      var prefixes = {
        template  : 'components/'
      };
      return type + ':' + (prefixes[type] || '') + 'lio-';
    }

    return result;
  }, {}),

  resolve: function(fullName) {
    return this.testSubjects[fullName] || this._super.apply(this, arguments);
  }
}).create());

function buildComponent(test, props) {
  var component = test.subject(props);

  test.append();

  return component;
}

function compileTemplate(fn) {
  return Ember.Handlebars.compile(heredoc(fn));
}

function heredoc (f) {
  return f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
}

function tagNameFor(view, selector) {
  return view.$(selector).get(0).tagName.toLowerCase();
}
