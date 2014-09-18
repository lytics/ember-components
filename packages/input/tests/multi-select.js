(function() {

moduleForComponent('lio-multi-select', 'MultiSelectComponent', {
  needs: [
    'component:lio-option',
    'component:lio-button',
  ]
});

var defaultTemplate = compileTemplate(function() {/*
  {{lio-option value=1}}
  {{lio-option value=2}}
  {{lio-option value=3}}
*/});

test("component has correct tag name", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate
  });

  equal(tagNameFor(component), 'lio-multi-select', "component has 'lio-multi-select' tag");
});

test("options cannot have duplicate values", function() {
  var context = this;

  this.subject({
    layout: compileTemplate(function() {/*
      {{lio-option value=1}}
      {{lio-option value=1}}
    */})
  });

  throws(function() {
    context.append();
  }, /Options in 'lio-multi-select' components cannot contain duplicate values./);
});

test("the 'values' attribute cannot contain duplicates", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate
  });

  throws(function() {
    component.set('values', [ 1, 1 ]);
  }, /The 'value' attribute of 'lio-multi-select' components must not contain duplicate values./);
});

test("options with values contained in the 'values' attribute initially are set to selected", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate,
    values: [ 1, 3 ]
  });

  ok(component.$('lio-option:nth-of-type(1)').hasClass('selected'), "first option has 'selected' class");
  ok(!component.$('lio-option:nth-of-type(2)').hasClass('selected'), "second option does not have 'selected' class");
  ok(component.$('lio-option:nth-of-type(3)').hasClass('selected'), "third option has 'selected' class");
});

test("the 'values' attribute is initialized with options that are selected if it is falsy", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(function() {/*
      {{lio-option value=1 selected=true}}
      {{lio-option value=2}}
      {{lio-option value=3 selected=true}}
    */}),
    values: null
  });

  deepEqual(component.get('values'), [ 1, 3 ]);
});

test("adding an element to the 'value' attribute sets the corresponding option to selected", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate,
    values: [ 1 ]
  });

  ok(!component.$('lio-option:nth-of-type(3)').hasClass('selected'), "third option does not have 'selected' class");
  Ember.run(function() {
    component.get('values').pushObject(3);
  });
  ok(component.$('lio-option:nth-of-type(3)').hasClass('selected'), "third option has 'selected' class");
});

test("selecting an option adds its value to the 'values' attribute", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate,
    values: [ 1 ]
  });

  var lastOption = component.componentsForType('option').get('lastObject');

  ok(!component.$('lio-option:nth-of-type(3)').hasClass('selected'), "third option does not have 'selected' class");
  Ember.run(lastOption, 'set', 'selected', true);
  ok(component.$('lio-option:nth-of-type(3)').hasClass('selected'), "third option has 'selected' class");
});

test("the property bound to the `value` attribute is replaced when the selection changes", function() {
  var contextObject = Ember.Object.create({
    value: []
  });

  var component = buildComponent(this, {
    layout: defaultTemplate,
    contextObject: contextObject,
    valuesBinding: 'contextObject.values'
  });

  var lastOption = component.componentsForType('option').get('lastObject');
  var values = contextObject.get('values');

  Ember.run(lastOption, 'set', 'selected', true);
  notStrictEqual(values, contextObject.get('values'), "property bound to 'values' was replaced");
});

test("clicking an option toggles its selected state", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate
  });

  var lastOption = component.componentsForType('option').get('lastObject');

  ok(!lastOption.get('selected'));
  component.$('lio-option:nth-of-type(3)').simulate('click');
  ok(lastOption.get('selected'));
  component.$('lio-option:nth-of-type(3)').simulate('click');
  ok(!lastOption.get('selected'));
});

test("clicking an option when the component is disabled has no effect", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate,
    disabled: true,
    values: []
  });

  component.$('lio-option:nth-of-type(1)').simulate('click');
  deepEqual(component.get('values'), [], "`values` attribute did not change");
});

test("all options are disabled when the component is disabled", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate,
    disabled: true,
    values: []
  });

  ok(component.$('lio-option:nth-of-type(1)').hasClass('disabled'), "first option has 'disabled' class");
  ok(component.$('lio-option:nth-of-type(2)').hasClass('disabled'), "second option has 'disabled' class");
  ok(component.$('lio-option:nth-of-type(3)').hasClass('disabled'), "third option has 'disabled' class");
});

test("clicking an option triggers the component's default action", function() {
  expect(2);

  var contextObject = Ember.Object.create({
    values: []
  });

  var targetObject = {
    action: function(values) {
      deepEqual(values, [ 1 ], "default action was triggered with the new values");
      deepEqual(contextObject.get('values'), [ 1 ], "the values changed in their own run loop");
    }
  };

  var component = buildComponent(this, {
    layout: defaultTemplate,
    contextObject: contextObject,
    valuesBinding: 'contextObject.values',
    action: 'action',
    targetObject: targetObject
  });

  component.$('lio-option:nth-of-type(1)').simulate('click');
});

test("clicking the 'select-all' button selects all options", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(function() {/*
      {{lio-option value=1}}
      {{lio-option value=2}}
      {{lio-option value=3}}

      {{lio-button action="select-all"}}
    */}),
    values: [ 1 ]
  });

  component.$('lio-button[action="select-all"]').simulate('click');
  ok(component.$('lio-option:nth-of-type(1)').hasClass('selected'), "first option has 'selected' class");
  ok(component.$('lio-option:nth-of-type(2)').hasClass('selected'), "second option has 'selected' class");
  ok(component.$('lio-option:nth-of-type(3)').hasClass('selected'), "third option has 'selected' class");
});

test("the 'select-all' button is disabled when all options are selected", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(function() {/*
      {{lio-option value=1}}
      {{lio-option value=2}}
      {{lio-option value=3}}

      {{lio-button action="select-all"}}
    */}),
    values: [ 1, 2, 3 ]
  });

  ok(component.$('lio-button[action="select-all"]').hasClass('disabled'), "'select all' button has 'disabled' class");
  component.$('lio-option:nth-of-type(1)').simulate('click');
  ok(!component.$('lio-button[action="select-all"]').hasClass('disabled'), "'select all' button does not have 'disabled' class");
  component.$('lio-option:nth-of-type(1)').simulate('click');
  ok(component.$('lio-button[action="select-all"]').hasClass('disabled'), "'select all' button has 'disabled' class");
});

test("clicking the 'select-all' button has no effect when the component is disabled", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate,
    disabled: true,
    values: []
  });

  component.$('lio-button[action="select-all"]').simulate('click');
  deepEqual(component.get('values'), [], "`values` attribute did not change");
});

test("clicking the 'select-all' button triggers the component's default action", function() {
  expect(2);

  var contextObject = Ember.Object.create({
    values: []
  });

  var targetObject = {
    action: function(values) {
      deepEqual(values, [ 1, 2, 3 ], "default action was triggered with the new values");
      deepEqual(contextObject.get('values'), [ 1, 2, 3 ], "the values changed in their own run loop");
    }
  };

  var component = buildComponent(this, {
    layout: compileTemplate(function() {/*
      {{lio-option value=1}}
      {{lio-option value=2}}
      {{lio-option value=3}}

      {{lio-button action="select-all"}}
    */}),
    contextObject: contextObject,
    valuesBinding: 'contextObject.values',
    action: 'action',
    targetObject: targetObject
  });

  component.$('lio-button[action="select-all"]').simulate('click');
});

test("clicking the 'unselect-all' button unselects all options", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(function() {/*
      {{lio-option value=1}}
      {{lio-option value=2}}
      {{lio-option value=3}}

      {{lio-button action="unselect-all"}}
    */}),
    values: [ 1, 3 ]
  });

  component.$('lio-button[action="unselect-all"]').simulate('click');
  ok(!component.$('lio-option:nth-of-type(1)').hasClass('selected'), "first option does not have 'selected' class");
  ok(!component.$('lio-option:nth-of-type(2)').hasClass('selected'), "second option does not have 'selected' class");
  ok(!component.$('lio-option:nth-of-type(3)').hasClass('selected'), "third option does not have 'selected' class");
});

test("the 'unselect-all' button is disabled when no options are selected", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(function() {/*
      {{lio-option value=1}}
      {{lio-option value=2}}
      {{lio-option value=3}}

      {{lio-button action="unselect-all"}}
    */}),
    values: []
  });

  ok(component.$('lio-button[action="unselect-all"]').hasClass('disabled'), "'unselect all' button has 'disabled' class");
  component.$('lio-option:nth-of-type(1)').simulate('click');
  ok(!component.$('lio-button[action="unselect-all"]').hasClass('disabled'), "'unselect all' button does not have 'disabled' class");
  component.$('lio-option:nth-of-type(1)').simulate('click');
  ok(component.$('lio-button[action="unselect-all"]').hasClass('disabled'), "'unselect all' button has 'disabled' class");
});

test("clicking the 'unselect-all' button has no effect when the component is disabled", function() {
  var component = buildComponent(this, {
    layout: defaultTemplate,
    disabled: true,
    values: [ 1, 3 ]
  });

  component.$('lio-button[action="select-all"]').simulate('click');
  deepEqual(component.get('values'), [ 1, 3 ], "`values` attribute did not change");
});

test("clicking the 'unselect-all' button triggers the component's default action", function() {
  expect(2);

  var contextObject = Ember.Object.create({
    values: [ 1, 3 ]
  });

  var targetObject = {
    action: function(values) {
      deepEqual(values, [], "default action was triggered with the new values");
      deepEqual(contextObject.get('values'), [], "the values changed in their own run loop");
    }
  };

  var component = buildComponent(this, {
    layout: compileTemplate(function() {/*
      {{lio-option value=1}}
      {{lio-option value=2}}
      {{lio-option value=3}}

      {{lio-button action="unselect-all"}}
    */}),
    contextObject: contextObject,
    valuesBinding: 'contextObject.values',
    action: 'action',
    targetObject: targetObject
  });

  component.$('lio-button[action="unselect-all"]').simulate('click');
});

test("clicking an option with the 'unselect' attribute unselects the option with the corresponding value", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(function() {/*
      {{lio-option value=1}}
      {{lio-option value=2}}
      {{lio-option value=3}}

      {{lio-option unselect=true value=1}}
    */}),
    values: [ 1 ]
  });

  ok(component.$('lio-option:nth-of-type(4)').hasClass('unselect'), "unselect option has 'unselect' class");
  component.$('lio-option.unselect').simulate('click');
  ok(!component.$('lio-option:nth-of-type(1)').hasClass('selected'), "first option does not have 'selected' class");
});

})();
