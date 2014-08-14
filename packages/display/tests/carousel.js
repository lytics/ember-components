(function() {

moduleForComponent('lio-carousel', 'CarouselComponent', {
  needs: [
    'component:lio-content',
    'component:lio-label',
    'component:lio-button',
  ]
});

test("component has correct tag name", function() {
  var component = buildComponent(this, {
    template: compileTemplate(function() {/*
      {{#lio-content}}foo{{/lio-content}}
      {{#lio-content}}bar{{/lio-content}}
    */})
  });

  equal(tagNameFor(component), 'lio-carousel', "component has 'lio-carousel' tag");
});

test("the first content item has the correct class when none are marked as active", function() {
  var component = buildComponent(this, {
    template: compileTemplate(function() {/*
      {{#lio-content}}foo{{/lio-content}}
      {{#lio-content}}bar{{/lio-content}}
    */})
  });

  ok(component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item has the 'active' class");
  ok(!component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item does not have the 'active' class");
});

test("the content item marked as active has the correct class", function() {
  var component = buildComponent(this, {
    template: compileTemplate(function() {/*
      {{#lio-content}}foo{{/lio-content}}
      {{#lio-content active=true}}bar{{/lio-content}}
    */})
  });

  ok(!component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item does not have the 'active' class");
  ok(component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item has the 'active' class");
});

test("only one content item can be active", function() {
  var context = this;

  this.subject({
    template: compileTemplate(function() {/*
      {{#lio-content active=true}}foo{{/lio-content}}
      {{#lio-content active=true}}bar{{/lio-content}}
    */})
  });

  throws(function() {
    context.append();
  }, /The 'lio-carousel' component can only have one active 'lio-content' component./);
});

test("clicking the 'forward' button activates the next content item", function() {
  var component = buildComponent(this, {
    disableTransitions: true,
    template: compileTemplate(function() {/*
      {{#lio-content active=true}}foo{{/lio-content}}
      {{#lio-content}}bar{{/lio-content}}
      {{#lio-button action="forward"}}›{{/lio-button}}
    */})
  });

  component.$('lio-button[action="forward"]').simulate('click');
  ok(!component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item does not have the 'active' class");
  ok(component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item has the 'active' class");
});

test("clicking the 'forward' button multiple times activates sequential content items", function() {
  var component = buildComponent(this, {
    disableTransitions: true,
    template: compileTemplate(function() {/*
      {{#lio-content active=true}}foo{{/lio-content}}
      {{#lio-content}}bar{{/lio-content}}
      {{#lio-content}}baz{{/lio-content}}
      {{#lio-button action="forward"}}›{{/lio-button}}
    */})
  });

  component.$('lio-button[action="forward"]').simulate('click').simulate('click');
  ok(!component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item does not have the 'active' class");
  ok(!component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item does not have the 'active' class");
  ok(component.$('lio-content:nth-of-type(3)').hasClass('active'), "the third content item has the 'active' class");
});

test("clicking the 'forward' button activates the first content item when the last item is active", function() {
  var component = buildComponent(this, {
    disableTransitions: true,
    template: compileTemplate(function() {/*
      {{#lio-content}}foo{{/lio-content}}
      {{#lio-content active=true}}bar{{/lio-content}}
      {{#lio-button action="forward"}}›{{/lio-button}}
    */})
  });

  component.$('lio-button[action="forward"]').simulate('click');
  ok(component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item has the 'active' class");
  ok(!component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item does not have the 'active' class");
});

test("clicking the 'backward' button activates the previous content item", function() {
  var component = buildComponent(this, {
    disableTransitions: true,
    template: compileTemplate(function() {/*
      {{#lio-content}}foo{{/lio-content}}
      {{#lio-content active=true}}bar{{/lio-content}}
      {{#lio-button action="backward"}}‹{{/lio-button}}
    */})
  });

  component.$('lio-button[action="backward"]').simulate('click');
  ok(component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item has the 'active' class");
  ok(!component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item does not have the 'active' class");
});

test("clicking the 'backward' button activates the last content item when the first item is active", function() {
  var component = buildComponent(this, {
    disableTransitions: true,
    template: compileTemplate(function() {/*
      {{#lio-content active=true}}foo{{/lio-content}}
      {{#lio-content}}bar{{/lio-content}}
      {{#lio-button action="backward"}}‹{{/lio-button}}
    */})
  });

  component.$('lio-button[action="backward"]').simulate('click');
  ok(!component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item does not have the 'active' class");
  ok(component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item has the 'active' class");
});

test("the number of labels must be the same as the number of content items", function() {
  var context = this;

  this.subject({
    template: compileTemplate(function() {/*
      {{#lio-content}}foo{{/lio-content}}
      {{#lio-content}}bar{{/lio-content}}
      {{lio-label}}
    */})
  });

  throws(function() {
    context.append();
  }, /The 'lio-carousel' component must have the same number of 'lio-label' components as 'lio-content' components./);
});

test("clicking a label activates the content item with the same index", function() {
  var component = buildComponent(this, {
    disableTransitions: true,
    template: compileTemplate(function() {/*
      {{#lio-content active=true}}foo{{/lio-content}}
      {{#lio-content}}bar{{/lio-content}}
      {{lio-label}}
      {{lio-label}}
    */})
  });

  component.$('lio-label:nth-of-type(2)').simulate('click');
  ok(!component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item does not have the 'active' class");
  ok(component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item has the 'active' class");
});

test("labels are activated at the same index as the content item", function() {
  var component = buildComponent(this, {
    disableTransitions: true,
    template: compileTemplate(function() {/*
      {{#lio-content active=true}}foo{{/lio-content}}
      {{#lio-content}}bar{{/lio-content}}
      {{lio-label}}
      {{lio-label}}
    */})
  });

  ok(component.$('lio-label:nth-of-type(1)').hasClass('active'), "the first label has the 'active' class");
  ok(!component.$('lio-label:nth-of-type(2)').hasClass('active'), "the second label does not have the 'active' class");
  component.$('lio-label:nth-of-type(2)').simulate('click');
  ok(!component.$('lio-label:nth-of-type(1)').hasClass('active'), "the first label does not have the 'active' class");
  ok(component.$('lio-label:nth-of-type(2)').hasClass('active'), "the second label has the 'active' class");
});

test("the component has the correct class when it contains no content items", function() {
  var component = buildComponent(this, {
    template: compileTemplate(function() {/* */})
  });

  ok(component.$().hasClass('empty'), "has the 'empty' class");
});

test("the component has the correct class when it contains one content item", function() {
  var component = buildComponent(this, {
    template: compileTemplate(function() {/*
      {{#lio-content}}foo{{/lio-content}}
    */})
  });

  ok(component.$().hasClass('single'), "has the 'single' class");
});

test("transition classes are added when activating content items", function() {
  mockGlobalPath('$.support.transition', { end: 'testEvent' }, this, function() {
    var component = buildComponent(this, {
      template: compileTemplate(function() {/*
        {{#lio-content active=true}}foo{{/lio-content}}
        {{#lio-content}}bar{{/lio-content}}
        {{#lio-button action="forward"}}›{{/lio-button}}
        {{#lio-button action="backward"}}‹{{/lio-button}}
      */})
    });
    var triggerTransitionEnd = function() {
      component.componentsForType('content').invoke('trigger', 'transitionDidEnd');
    };

    component.$('lio-button[action="forward"]').simulate('click');
    ok(component.$('lio-content:nth-of-type(1)').hasClass('forward'), "the first content item has the 'forward' class");
    ok(component.$('lio-content:nth-of-type(2)').hasClass('forward'), "the second content item has the 'forward' class");
    Ember.run(triggerTransitionEnd);
    ok(!component.$('lio-content:nth-of-type(1)').hasClass('forward'), "the first content item does not have the 'forward' class");
    ok(!component.$('lio-content:nth-of-type(2)').hasClass('forward'), "the second content item does not have the 'forward' class");
    ok(!component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item does not have the 'active' class");
    ok(component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item has the 'active' class");
    component.$('lio-button[action="backward"]').simulate('click');
    ok(component.$('lio-content:nth-of-type(1)').hasClass('backward'), "the first content item has the 'backward' class");
    ok(component.$('lio-content:nth-of-type(2)').hasClass('backward'), "the second content item has the 'backward' class");
    Ember.run(triggerTransitionEnd);
    ok(!component.$('lio-content:nth-of-type(1)').hasClass('backward'), "the first content item does not have the 'backward' class");
    ok(!component.$('lio-content:nth-of-type(2)').hasClass('backward'), "the second content item does not have the 'backward' class");
    ok(component.$('lio-content:nth-of-type(1)').hasClass('active'), "the first content item has the 'active' class");
    ok(!component.$('lio-content:nth-of-type(2)').hasClass('active'), "the second content item does not have the 'active' class");
  });
});

})();
