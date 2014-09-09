define(
  ["../namespace","../mixin/parent","../mixin/active-state","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ParentComponentMixin = __dependency2__["default"] || __dependency2__;
    var ActiveStateMixin = __dependency3__["default"] || __dependency3__;
    var Component = __dependency4__.Component;
    var Object = __dependency4__.Object;
    var String = __dependency4__.String;
    var get = __dependency4__.get;
    var set = __dependency4__.set;
    var assert = __dependency4__.assert;

    var typeKey = 'tip';

    /**
      Tip Component

      This component hides and shows contextual information for a given label.
      When this label is given focus, the content is shown. Likewise, on blur, the
      content is hidden.

      ```handlebars
      {{#lio-tip}}
        {{lio-label}}
        {{lio-popover}}
      {{/lip-tip}}
      ```
    */
    // TODO debt: currently, a div in the popover of a tip that is in a paragraph will
    // break the universe. The popover component needs to be moved elsewhere in the DOM
    __exports__["default"] = Component.extend(ParentComponentMixin, ActiveStateMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      //
      // Handlebars Attributes
      //

      activator: 'click',

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'content', 'popover', 'label' ],

      fromFocus: false,

      togglePopover: function() {
        set(get(this, 'popover'), 'active', get(this, 'active'));
      }.observes('active'),

      label: function() {
        return get(this.componentsForType('label'), 'firstObject');
      }.property(),

      popover: function() {
        return get(this.componentsForType('popover'), 'firstObject');
      }.property(),

      //
      // Event Handlers
      //

      click: function(event) {
        if (get(this, 'fromFocus')) {
          set(this, 'fromFocus', false);
          return;
        }
        if (get(this, 'activator') === 'click') {
          this.send('toggleActive');
        }
      },

      mouseEnter: function() {
        if (get(this, 'activator') === 'hover') {
          this.send('activate');
        }
      },

      mouseLeave: function() {
        if (get(this, 'activator') === 'hover') {
          this.send('deactivate');
        }
      },

      focusIn: function() {
        set(this, 'fromFocus', true);
        this.send('activate');
      },

      focusOut: function() {
        set(this, 'fromFocus', false);
        this.send('deactivate');
      },

      keyPress: function(event) {
        if (event.which === 13) {
          this.send('toggleActive');
        } else if (event.which === 27) {
          this.send('deactivate');
        }
      },

      //
      // Hooks / Observers
      //

      verifyContents: function() {
        var labelsLength = get(this.componentsForType('label'), 'length');
        var popoversLength = get(this.componentsForType('popover'), 'length');
        assert(String.fmt("The '%@' component must have a single 'lio-label' and a single 'lio-popover'", [ get(this, 'tagName') ]), labelsLength === 1 && popoversLength === 1);

        set(get(this, 'popover'), 'anchor', get(this, 'label').$());
        set(get(this, 'popover'), 'alignToParent', true);
      }.on('didRegisterComponents')
    });
  });