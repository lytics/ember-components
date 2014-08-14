emq.globalize();

var global = this;

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

function mockPath(obj, path, mock, target, callback) {
  if (!callback) {
    callback = target;
    target = null;
  }

  var lastPath, subPath, value;
  var parts = path.split('.');

  // Save all intermediate values while resetting values
  var oldValues = parts.reduce(function(values, part, index) {
    lastPath = values.get('lastObject.path');
    subPath = (lastPath ? lastPath + '.' : '') + part;
    value = Ember.get(obj, subPath);

    values.pushObject({
      path: subPath,
      value: value
    });

    if (index === parts.length - 1) {
      // Set path to mock object
      Ember.set(obj, path, mock);
    } else if (!value) {
      // Make sure the full path can be set by setting falsy intermediate values
      // to new objects
      Ember.set(obj, subPath, {});
    }

    return values;
  }, Ember.A());

  // Invoke callback with given target now that the path is mocked
  callback.call(target);

  // Restore old values in sequence, stopping at the first non-object
  oldValues.every(function(pair) {
    subPath = pair.path;
    value = pair.value;

    if (Ember.get(obj, subPath) !== value) {
      Ember.set(obj, path, value);
    }

    return Ember.typeOf(value) !== 'object';
  });
}

function mockGlobalPath(path, mock, target, callback) {
  mockPath(global, path, mock, target, callback);
}
