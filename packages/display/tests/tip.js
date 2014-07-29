(function() {

moduleForComponent('lio-tip', 'TipComponent', {
  needs: [
    'component:lio-label',
    'component:lio-popover'
  ]
});

test("component has correct tag name", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate)
  });

  equal(tagNameFor(component), 'lio-tip', "component has 'lio-tip' tag");
});

test("component is active when the label is clicked", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate)
  });

  ok(!component.get('active'), "component is inactive by default");
  component.$('lio-label').simulate('click');
  ok(component.get('active'), "component is active when the label is clicked");
});

test("component is active when the label is hovered and the activator is set to hover", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate),
    activator: 'hover'
  });

  ok(!component.get('active'), "component is inactive by default");
  component.$('lio-label').trigger('mouseenter');
  ok(component.get('active'), "component is active when the label is 'mouse entered'");
  component.$('lio-label').trigger('mouseleave');
  ok(!component.get('active'), "component is no longer active once the label has 'mouse left'");
});

test("component has the active class when it is active", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate),
    active: true
  });

  ok(component.$().hasClass('active'), "the active class is present when active is true");
});

test("it is active when focused", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate),
    active: false
  });

  component.$('lio-label').focusin();
  ok(component.get('active'));
});

test("it is not active when blurred", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate),
    active: true
  });

  component.$('lio-label').focusout();
  ok(!component.get('active'));
});

test("the popover is open when active", function() {
  var component = buildComponent(this, {
    layout: compileTemplate(defaultTemplate),
    active: true
  });

  ok(component.get('popover').$().is(':visible'));
});

test("the component throws if there isn't a popover", function() {
  var context = this;

  this.subject({
    template: compileTemplate(function() {/*
      {{lio-label}}
    */})
  });

  throws(function() {
    context.append();
  }, /The 'lio-tip' component must have a single 'lio-label' and a single 'lio-popover'/);
});

test("the component throws if there is more than one popover", function() {
  var context = this;

  this.subject({
    template: compileTemplate(function() {/*
      {{lio-label}}
      {{lio-popover}}
      {{lio-popover}}
    */})
  });

  throws(function() {
    context.append();
  }, /The 'lio-tip' component must have a single 'lio-label' and a single 'lio-popover'/);
});

test("the component throws if there isn't a label", function() {
  var context = this;

  this.subject({
    template: compileTemplate(function() {/*
      {{lio-popover}}
    */})
  });

  throws(function() {
    context.append();
  }, /The 'lio-tip' component must have a single 'lio-label' and a single 'lio-popover'/);
});

test("the component throws if there is more than one label", function() {
  var context = this;

  this.subject({
    template: compileTemplate(function() {/*
      {{lio-popover}}
    */})
  });

  throws(function() {
    context.append();
  }, /The 'lio-tip' component must have a single 'lio-label' and a single 'lio-popover'/);
});

function defaultTemplate() {/*
  {{#lio-label}}The label for the tip{{/lio-label}}
  {{#lio-popover}}The popover for the tip{{/lio-popover}}
*/}

})();