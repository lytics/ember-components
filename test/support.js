emq.globalize();

setResolver(Ember.DefaultResolver.extend({
  testSubjects: Object.keys(Lytics.Components).reduce(function(result, key) {
    var containerKey;

    [ 'component', 'mixin', 'template' ].forEach(function(type) {
      if (key.indexOf(type.capitalize()) !== -1) {
        containerKey = prefix(type) + 'lio-' + key.replace(type.capitalize(), '').dasherize();
      }

      result[containerKey] = Lytics.Components[key];
    });

    function prefix(type) {
      var prefixes = {
        template  : 'components/'
      };
      return type + ':' + (prefixes[type] || '');
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
