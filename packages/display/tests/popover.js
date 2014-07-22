moduleForComponent('lio-popover', 'PopoverComponent', {
  needs: [
    'template:components/lio-popover',
  ]
});

test("component has correct tag name", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate)
  });

  equal(tagNameFor(component), 'lio-popover', "component has 'lio-popover' tag");
});

test("position must be one of a limited set of values", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate)
  });

  $('<div id="anchor">').appendTo('#ember-testing');
  component.set('anchor', '#anchor');

  Ember.run(function() {
    equal(component.get('position'), 'top', "The default position is 'top'");

    component.set('position', 'right');
    equal(component.get('position'), 'right', "The position can be set");

    throws(function() {
      component.set('position', 'nope');
    }, "The position cannot be set to something not in the positions array");

    equal(component.get('position'), 'right');
  });
});

test("the rendered position is different than position when the tooltip needs to flip", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate)
  });

  $('<div id="anchor">').appendTo('#ember-testing');
  component.set('anchor', '#anchor');

  Ember.run(function() {
    component.send('open');
    giveBounds(component);
    component.adjustPosition();
    equal(component.get('position'), 'top');
    equal(component.get('renderedPosition'), 'bottom');
  });
});

test("it has the 'open' class when open", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate),
    open: true
  });

  $('<div id="anchor">').appendTo('#ember-testing');
  ok(component.$().hasClass('open'));
  ok(!component.$().hasClass('closed'));
});

test("it has the 'closed' class when closed", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate),
    open: false
  });

  $('<div id="anchor">').appendTo('#ember-testing');
  ok(component.$().hasClass('closed'));
  ok(!component.$().hasClass('open'));
});

test("className is based off the rendered position", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate)
  });

  $('<div id="anchor">').appendTo('#ember-testing');
  component.set('anchor', '#anchor');

  Ember.run(function() {
    component.send('open');
    component.set('position', 'left');
    giveBounds(component);
    component.adjustPosition();
    equal(component.get('renderedPosition'), 'right');
    Ember.run.next(function() {
      ok(component.$().hasClass('right'));
      ok(!component.$().hasClass('left'));
    });
  });
});

test("the arrow position is centered on the popover", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate)
  });

  $('<div id="anchor">').appendTo('#ember-testing');
  component.set('anchor', '#anchor');

  Ember.run(function() {
    component.send('open');

    giveBounds(component, {
      offsetTop: 500,
      offsetLeft: 500
    });
    component.adjustPosition();
    component.positioners[component.get('renderedPosition')](component);

    deepEqual(component.get('arrowOffset'), {
      top: 50,
      left: 45
    }, "the arrow is positioned correctly when the anchor is centered and the position is top");

    giveBounds(component);
    component.adjustPosition();
    component.positioners[component.get('renderedPosition')](component);

    deepEqual(component.get('arrowOffset'), {
      top: -10,
      left: 45
    }, "the arrow is positioned correctly when the anchor is in the top left and the position is top");

    giveBounds(component, {
      offsetLeft: 700
    });
    component.adjustPosition();
    component.positioners[component.get('renderedPosition')](component);

    deepEqual(component.get('arrowOffset'), {
      top: -10,
      left: 45
    }, "the arrow is positioned correctly when the anchor is in the top right and the position is top");

    component.set('position', 'left');

    giveBounds(component, {
      offsetTop: 500,
      offsetLeft: 500
    });
    component.adjustPosition();
    component.positioners[component.get('renderedPosition')](component);

    deepEqual(component.get('arrowOffset'), {
      top: 20,
      left: 100
    }, "the arrow is positioned correctly when the anchor is in the center and the position is left");

    giveBounds(component);
    component.adjustPosition();
    component.positioners[component.get('renderedPosition')](component);

    deepEqual(component.get('arrowOffset'), {
      top: 20,
      left: -10
    }, "the arrow is positioned correctly when the anchor is in the top left and the position is left");

    giveBounds(component, {
      offsetTop: 800,
      offsetLeft: 500
    });
    component.adjustPosition();
    component.positioners[component.get('renderedPosition')](component);

    deepEqual(component.get('arrowOffset'), {
      top: 20,
      left: 100
    }, "the arrow is positioned correctly when the anchor is in the bottom left and the position is left");
  });
});

test("the tooltip is repositioned when the window resizes", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate),
  });

  $('<div id="anchor">').appendTo('#ember-testing');
  component.set('anchor', '#anchor');

  Ember.run(function() {
    component.send('open');
    giveBounds(component, {
      offsetTop: 1337
    });

    component.adjustPosition();
    equal(component.get('offsetTop'), 1337);

    $(window).trigger('resize');
    notEqual(component.get('offsetTop'), 1337);
  });

});

function defaultTemplate() {/*
  This is the contents of the popover
*/}

function giveBounds(component, overrides) {
  component.setProperties(Ember.merge({
    offsetTop: 10,
    offsetLeft: 10,

    windowWidth: 1000,
    windowHeight: 1000,

    width: 100,
    height: 50,

    anchorWidth: 300,
    anchorHeight: 30,

    arrowWidth: 10,
    arrowHeight: 10,

    arrowOffsetTop: 50 / 2 - 10 / 2,
    arrowOffsetLeft: 100 / 2 - 10 / 2
  }, overrides));
}
