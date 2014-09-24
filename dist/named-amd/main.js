define("lytics-components/browser",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var $ = __dependency1__.$;

    // Taken from Bootstrap/Modernizr
    function testTrasitionSupport() {
      var support = $.support.transition || false;

      // Test jQuery's support object so this doesn't have to happen multiple times
      // if bootstrap has already been included
      if (support) { return; }

      var endEventMap = {
        'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
        'MozTransition'    : 'transitionend',      // only for FF < 15
        'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
      };

      var el = document.createElement('transition-support');

      for (var name in endEventMap) {
        if (el.style[name] !== undefined) {
          support = { end: endEventMap[name] };
          break;
        }
      }

      $.support.transition = support;
    }

    __exports__.testTrasitionSupport = testTrasitionSupport;
  });
define("lytics-components/common/button",
  ["../namespace","../mixin/child","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var Component = __dependency3__.Component;
    var get = __dependency3__.get;
    var computed = __dependency3__.computed;
    var assert = __dependency3__.assert;

    var typeKey = 'button';

    /**
      Button Component

      This component creates a clickable element that sends an action to its parent
      component. The action name is specified by the `action` attribute, which is
      required.
      */
    __exports__["default"] = Component.extend(ChildComponentMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      attributeBindings: [ 'action', 'disabled' ],

      classNameBindings: [ 'disabled' ],

      //
      // Handlebars Attributes
      //

      action: null,

      disabled: false,

      //
      // Internal Properties
      //

      typeKey: typeKey,

      isDisabled: computed.readOnly('disabled'),

      //
      // Event Handlers
      //

      click: function() {
        // Do not perform the action if the component is disabled
        if (get(this, 'isDisabled')) { return; }

        var action = get(this, 'action');

        assert("All '" + get(this, 'tagName') + "' components must define an `action` attribute.", action);

        get(this, 'parent').send(Ember.String.camelize(action));
      }
    });
  });
define("lytics-components/common/content",
  ["../namespace","../mixin/child","../mixin/active-state","../mixin/transition","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var ActiveStateMixin = __dependency3__["default"] || __dependency3__;
    var TransitionMixin = __dependency4__["default"] || __dependency4__;
    var Component = __dependency5__.Component;

    var typeKey = 'content';

    /**
      Content Component

      This component simply wraps a unit of content.
    */
    __exports__["default"] = Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      //
      // Internal Properties
      //

      typeKey: typeKey
    });
  });
define("lytics-components/common/filter",
  ["../namespace","../mixin/parent","../mixin/child","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ParentComponentMixin = __dependency2__["default"] || __dependency2__;
    var ChildComponentMixin = __dependency3__["default"] || __dependency3__;
    var A = __dependency4__.A;
    var Component = __dependency4__.Component;
    var get = __dependency4__.get;
    var set = __dependency4__.set;
    var computed = __dependency4__.computed;
    var observer = __dependency4__.observer;
    var run = __dependency4__.run;
    var assert = __dependency4__.assert;

    var typeKey = 'filter';

    /**
      Filter Component

      This component provides an interface for filtering a set of components. The
      text field component provides the filter pattern and an optional button can
      be provided to clear the text field. Components are filtered based on their
      `innerText`, and when filtered out, the `filtered` property is set to true.

      ```handlebars
      {{#lio-filter}}
        {{lio-text-field}}
        {{lio-button action="clear"}}
      {{/lio-multi-select}}
      ```
    */
    __exports__["default"] = Component.extend(ParentComponentMixin, ChildComponentMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      //
      // Handlebars Attributes
      //

      value: null,

      debounce: 200,

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'text-field', 'button' ],

      textFieldComponent: computed(function() {
        return get(this.componentsForType('text-field'), 'firstObject');
      }).property('components.[]'),

      filterValue: computed.alias('textFieldComponent.value'),

      //
      // Internal Actions
      //

      actions: {
        clear: function() {
          set(this, 'filterValue', '');
          this.updateFilter();
        }
      },

      //
      // Hooks / Observers
      //

      // Verify dependencies and initialized CPs
      didRegisterComponents: function() {
        this._super();

        assert("The '" + get(this, 'tagName') + "' component must contain a single 'lio-text-field' component.", this.componentsForType('text-field').length === 1);

        // Prime the computed property so that it can be observed
        get(this, 'textFieldComponent');
      },

      debouncedFilterUpdate: Ember.observer('filterValue', function() {
        var interval = get(this, 'debounce');

        if (interval) {
          run.debounce(this, this.updateFilter, interval);
        } else {
          this.updateFilter();
        }
      }),

      updateFilter: function() {
        var filterValue = get(this, 'filterValue');
        var components = get(this, 'parent.filteredComponents');

        if (!filterValue) {
          components.invoke('set', 'filtered', false);
        } else {
          components.forEach(function(component) {
            var matches = fuzzyMatch(filterValue, component.$().text());

            set(component, 'filtered', !matches);
          });
        }
      }
    });

    // Simple fuzzy pattern matching using regular expressions, adapted from:
    // http://codereview.stackexchange.com/questions/23899/faster-javascript-fuzzy-string-matching-function
    function fuzzyMatch(pattern, str) {
      var cache = fuzzyMatch.cache || (fuzzyMatch.cache = {});
      var regexp = cache[pattern];

      if (!regexp) {
        regexp = cache[pattern] = new RegExp(pattern.split('').reduce(function(a, b) {
          return a + '[^' + b + ']*' + b;
        }), 'i');
      }

      return regexp.test(str);
    }
  });
define("lytics-components/common/label",
  ["../namespace","../mixin/child","../mixin/active-state","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var ActiveStateMixin = __dependency3__["default"] || __dependency3__;
    var Component = __dependency4__.Component;
    var get = __dependency4__.get;

    var typeKey = 'label';

    /**
      Label Component

      This component acts as a symbol or short description usually for another
      content component.
    */
    __exports__["default"] = Component.extend(ChildComponentMixin, ActiveStateMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      //
      // Internal Properties
      //

      typeKey: typeKey,

      //
      // Event Handlers
      //

      click: function() {
        get(this, 'parent').send('labelFocus', this);
      }
    });
  });
define("lytics-components/common/option",
  ["../namespace","../mixin/child","../mixin/active-state","../mixin/transition","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var ActiveStateMixin = __dependency3__["default"] || __dependency3__;
    var TransitionMixin = __dependency4__["default"] || __dependency4__;
    var Component = __dependency5__.Component;
    var get = __dependency5__.get;
    var set = __dependency5__.set;
    var computed = __dependency5__.computed;
    var uuid = __dependency5__.uuid;

    var typeKey = 'option';

    /**
      Option Component

      This component represents an option that the user can choose from. The value
      of the option is set through its `value` attribute, which defaults to the
      template's context if omitted (this makes looping over options easy). Options
      have a 'selected' state which is managed by the parent component, and an
      optional 'unselect' attribute which effectively makes the option a 'remove'
      button (with a value). When clicked, options send the 'select' event to their
      parent with its value, which can be disabled using the 'disabled' state.
      Options also have a class binding for an intelligent string representation of
      its value.
    */
    __exports__["default"] = Component.extend(ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      classNameBindings: [ 'valueClass', 'disabled', 'selected', 'unselect', 'filtered' ],

      //
      // Handlebars Attributes
      //

      option: null,

      value: computed(function() {
        // The 'content' path is the current context
        var path = this.get('valuePath');
        var option = this.get('option');

        return option && get(option, path);
      }).property('option', 'valuePath'),

      valuePath: computed.oneWay('parent.optionValuePath'),

      selected: false,

      unselect: false,

      disabled: computed.oneWay('parent.disabled'),

      filtered: false,

      //
      // Internal Properties
      //

      typeKey: typeKey,

      isSelected: computed.readOnly('selected'),

      isUnselect: computed.readOnly('unselect'),

      isDisabled: computed.readOnly('disabled'),

      isFiltered: computed.readOnly('filtered'),

      valueClass: computed(function() {
        var value = get(this, 'value');
        var type = Ember.typeOf(value);

        // Avoid '[Object object]' classes and complex toString'd values
        if (type === 'object' || type === 'instance') {
          // Look for an identifier, fall back on a uuid
          value = get(value, 'id') || ('option-' + get(this, 'uuid'));
        }

        return '' + value;
      }).property('value'),

      uuid: computed(function() {
        return uuid();
      }).property(),

      // Override the active state mixin's property to use the parent's value
      isActive: computed(function() {
        return get(this, 'value') === get(this, 'parent.value');
      }).property('value', 'parent.value'),

      //
      // Event Handlers
      //

      click: function() {
        // Do not perform the action if the component is disabled
        if (get(this, 'isDisabled')) { return; }

        var parent = get(this, 'parent');
        var isUnselect = get(this, 'isUnselect');
        var isSelected = get(this, 'isSelected');
        var value = get(this, 'value');

        // Don't set the select state directly; let the parent manage the state
        parent.send('select', value, isUnselect ? false : !isSelected);
      }
    }).reopenClass({
      create: function(props) {
        // If the 'value' attribute is not provided, default to using the
        // template's context for convenience
        if (!('option' in props)) {
          props.option = props._context;
        }

        return this._super(props);
      }
    });
  });
define("lytics-components/common/text-field",
  ["../namespace","../mixin/child","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var TextField = __dependency3__.TextField;

    var typeKey = 'text-field';

    /**
      Text Field Component

      This component is a thin wrapper around Ember's `TextField` component that
      registers itself with its parent component.
    */
    __exports__["default"] = TextField.extend(ChildComponentMixin, {
      //
      // Internal Properties
      //

      typeKey: typeKey
    });
  });
define("lytics-components/display/carousel",
  ["../namespace","../mixin/parent","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ParentComponentMixin = __dependency2__["default"] || __dependency2__;
    var Component = __dependency3__.Component;
    var get = __dependency3__.get;
    var set = __dependency3__.set;
    var computed = __dependency3__.computed;
    var assert = __dependency3__.assert;

    var typeKey = 'carousel';

    /**
      Carousel Component

      This component presents a list of content where one item is active at a time,
      with corresponding labels. Giving labels focus activates the content at the
      same index, and buttons with actions of 'forward' and 'backward' can also
      activate next/previous content items.

      ```handlebars
      {{#lio-carousel}}
        {{#lio-content active=true}}foo{{/lio-content}}
        {{#lio-content}}bar{{/lio-content}}
        {{#lio-content}}baz{{/lio-content}}

        {{lio-label}}
        {{lio-label}}
        {{lio-label}}

        {{#lio-button action="forward"}}›{{/lio-button}}
        {{#lio-button action="backward"}}‹{{/lio-button}}
      {{/lio-carousel}}
      ```
    */
    __exports__["default"] = Component.extend(ParentComponentMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      classNameBindings: [ 'isEmpty:empty',  'isSingle:single' ],

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'content', 'label', 'button' ],

      // The index of the content item currently active
      activeIndex: computed(function() {
        var contents = this.componentsForType('content');
        var active = contents.findBy('isActive');

        return contents.indexOf(active);
      }).property('components.@each.isActive').readOnly(),

      // The number of content items in the carousel
      contentLength: computed(function() {
        return get(this.componentsForType('content'), 'length');
      }).property('components.[]').readOnly(),

      // Whether or not the carousel has no content items
      isEmpty: computed.equal('contentLength', 0),

      // Whether or not there is only one content item
      isSingle: computed.equal('contentLength', 1),

      //
      // Internal Actions
      //

      actions: {
        // Activate the content at the previous index
        backward: function() {
          var activeIndex = get(this, 'activeIndex');
          var contentLength = get(this, 'contentLength');
          var nextIndex = activeIndex - 1;

          this.send('activate', nextIndex < 0 ? contentLength - 1 : nextIndex, 'backward');
        },

        // Activate the content at the next index
        forward: function() {
          var activeIndex = get(this, 'activeIndex');
          var contentLength = get(this, 'contentLength');
          var nextIndex = activeIndex + 1;

          this.send('activate', nextIndex >= contentLength ? 0 : nextIndex, 'forward');
        },

        // Activate the content at the given index
        activate: function(nextIndex, direction) {
          var activeIndex = get(this, 'activeIndex');

          // Nothing to do if the given index is already active
          if (activeIndex === nextIndex) { return; }

          // Don't attempt to transition to an invalid index
          if (nextIndex < 0 || nextIndex > get(this, 'contentLength')) { return; }

          var contents = this.componentsForType('content');
          var labels = this.componentsForType('label');
          var activeContent = contents.objectAt(activeIndex);

          // Abort if in the middle of a transition
          if (activeContent && get(activeContent, 'isTransitioning')) { return; }

          // Choose a direction based on the last/next index if none is given
          direction || (direction = nextIndex > activeIndex ? 'forward' : 'backward');

          activateNext(activeContent, contents.objectAt(nextIndex));
          activateNext(labels.objectAt(activeIndex), labels.objectAt(nextIndex));

          // Deactivate the current component and activate the next
          function activateNext(current, next) {
            if (current) {
              set(current, 'transitionClass', direction);
              current.send('deactivate');
            }

            if (next) {
              set(next, 'transitionClass', direction);
              next.send('activate');
            }
          }
        },

        // Respond to a label gaining focus
        labelFocus: function(label) {
          var labels = this.componentsForType('label');
          var nextIndex = labels.indexOf(label);

          if (nextIndex !== -1) {
            this.send('activate', nextIndex);
          }
        }
      },

      //
      // Hooks / Observers
      //

      // Set the initially active content if none is specified, and ensure there
      // are the same number of labels as content items and that the correct label
      // is activated initially
      didRegisterComponents: function() {
        this._super();

        var contents = this.componentsForType('content');
        var firstContent = contents.objectAt(0);

        assert("The '" + get(this, 'tagName') + "' component can only have one active 'lio-content' component.", contents.filterBy('isActive').length <= 1);

        if (!get(this, 'isEmpty') && get(this, 'activeIndex') === -1) {
          firstContent.send('activate');
        }

        var labels = this.componentsForType('label');
        var labelLength = get(labels, 'length');
        var activeIndex = get(this, 'activeIndex');

        assert("The '" + get(this, 'tagName') + "' component must have the same number of 'lio-label' components as 'lio-content' components.", !labelLength || labelLength === get(this.componentsForType('content'), 'length'));

        if (labelLength) {
          labels.objectAt(activeIndex).send('activate');
        }
      }
    });
  });
define("lytics-components/display/popover",
  ["../namespace","../mixin/parent","../mixin/child","../mixin/active-state","../mixin/transition","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ParentComponentMixin = __dependency2__["default"] || __dependency2__;
    var ChildComponentMixin = __dependency3__["default"] || __dependency3__;
    var ActiveStateMixin = __dependency4__["default"] || __dependency4__;
    var TransitionMixin = __dependency5__["default"] || __dependency5__;
    var A = __dependency6__.A;
    var Component = __dependency6__.Component;
    var String = __dependency6__.String;
    var get = __dependency6__.get;
    var set = __dependency6__.set;
    var setProperties = __dependency6__.setProperties;
    var getProperties = __dependency6__.getProperties;
    var computed = __dependency6__.computed;
    var observer = __dependency6__.observer;
    var assert = __dependency6__.assert;

    var typeKey = 'popover';
    var positions = A([ 'top', 'right', 'bottom', 'left' ]);

    /**
      Popover Component

      This component is a utility component for displaying and positioning a window of content
      with an arrow pointing to its anchor. It is constructed with an anchor and a preferred
      position. The position is subject to flip to remain in the frame.

      ```handlebars
      {{#lio-popover anchor='.jquery-selector' position='bottom'}}
        Freeform content
      {{/lio-popover}}
      ```
    */
    __exports__["default"] = Component.extend(ParentComponentMixin, ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      classNameBindings: [ 'renderedPosition' ],

      //
      // Handlebars Attributes
      //

      anchor: null,

      alignToParent: false,

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'button' ],

      canBeTopLevel: true,

      renderedPosition: null,

      position: computed(function(key, value) {
        if (arguments.length === 1) {
          return positions[0];
        } else {
          assert(String.fmt("Position must be one of %@", [ JSON.stringify(positions) ]), positions.contains(value));
          return value;
        }
      }).property(),

      offset: computed(function() {
        return {
          top: get(this, 'offsetTop'),
          left: get(this, 'offsetLeft')
        };
      }).property('offsetTop', 'offsetLeft').readOnly(),

      arrowOffset: computed(function() {
        return {
          top: get(this, 'arrowOffsetTop'),
          left: get(this, 'arrowOffsetLeft')
        };
      }).property('arrowOffsetTop', 'arrowOffsetLeft').readOnly(),

      positioners: {
        top: function(popover) {
          popover.adjustHorizontalPosition();
          setProperties(popover, {
            offsetTop: get(popover, 'offsetTop') - get(popover, 'height') - get(popover, 'arrowHeight'),
            arrowOffsetTop: get(popover, 'height')
          });
        },
        bottom: function(popover) {
          popover.adjustHorizontalPosition();
          setProperties(popover, {
            offsetTop: get(popover, 'offsetTop') + get(popover, 'anchorHeight') + get(popover, 'arrowHeight'),
            arrowOffsetTop: 0 - get(popover, 'arrowHeight')
          });
        },
        right: function(popover) {
          popover.adjustVerticalPosition();
          setProperties(popover, {
            offsetLeft: get(popover, 'offsetLeft') + get(popover, 'anchorWidth') + get(popover, 'arrowWidth'),
            arrowOffsetLeft:0 - get(popover, 'arrowWidth')
          });
        },
        left: function(popover) {
          popover.adjustVerticalPosition();
          setProperties(popover, {
            offsetLeft: get(popover, 'offsetLeft') - get(popover, 'width') - get(popover, 'arrowWidth'),
            arrowOffsetLeft: get(popover, 'width')
          });
        }
      },

      //
      // Hooks / Observers
      //

      // Add resize handler to window
      didInsertElement: function(view) {
        this._super(view);

        set(this, 'resizeHandler', $(window).on('resize', function() {
          this.reposition();
        }.bind(this)));
      },

      willDestroy: function() {
        this._super();

        $(window).unbind('resize', this.get('resizeHandler'));
      },

      //
      // Internal Methods
      //

      adjustPosition: function() {
        var position = get(this, 'position');
        var dimensions = getProperties(this, 'trueOffsetLeft', 'width', 'anchorWidth', 'windowWidth', 'trueOffsetTop', 'height', 'anchorHeight', 'windowHeight');

        // The rendered position is the opposite of the preferred position when there is no room where preferred
        if (position == 'left' && dimensions.trueOffsetLeft - dimensions.width < 0) {
          position = 'right';
        } else if (position == 'right' && dimensions.trueOffsetLeft + dimensions.width + dimensions.anchorWidth > dimensions.windowWidth) {
          position = 'left';
        } else if (position == 'top' && dimensions.trueOffsetTop - dimensions.height < 0) {
          position = 'bottom';
        } else if (position == 'bottom' && dimensions.trueOffsetTop + dimensions.height + dimensions.anchorHeight > dimensions.windowHeight) {
          position = 'top';
        }

        set(this, 'renderedPosition', position);
      },

      reposition: observer('position', 'active', function() {
        if (get(this, 'active')) {
          var $el = this.$();
          var $arrow = $el.find('.arrow');
          var $anchor = $(get(this, 'anchor'));
          var trueAnchorOffset = $anchor.offset();
          var anchorOffset = get(this, 'alignToParent') ? $anchor.position() : trueAnchorOffset;
          trueAnchorOffset || (trueAnchorOffset = { top: 0, left: 0});
          anchorOffset || (anchorOffset = { top: 0, left: 0 });

          setProperties(this, {
            offsetTop: anchorOffset.top,
            offsetLeft: anchorOffset.left,

            trueOffsetTop: trueAnchorOffset.top,
            trueOffsetLeft: trueAnchorOffset.left,

            windowWidth: $(window).width(),
            windowHeight: $(window).height(),

            width: $el.outerWidth(),
            height: $el.outerHeight(),

            anchorWidth: $anchor.width(),
            anchorHeight: $anchor.height(),

            arrowWidth: $arrow.outerWidth(),
            arrowHeight: $arrow.outerHeight(),
          });

          setProperties(this, {
            arrowOffsetTop: get(this, 'height') / 2 - get(this, 'arrowHeight') / 2,
            arrowOffsetLeft: get(this, 'width') / 2 - get(this, 'arrowWidth') / 2
          });

          // Flip if necessary
          this.adjustPosition();

          // Adjust based on position
          this.positioners[get(this, 'renderedPosition')](this);

          $el.css(get(this, 'offset'));
          $arrow.css(get(this, 'arrowOffset'));
        }
      }),

      adjustHorizontalPosition: function() {
        var dimensions = getProperties(this, 'arrowOffsetLeft', 'offsetLeft', 'width', 'anchorWidth', 'windowWidth');
        set(this, 'offsetLeft', adjustForEdges(dimensions.offsetLeft, dimensions.width, dimensions.anchorWidth, dimensions.windowWidth));
        set(this, 'arrowOffsetLeft', adjustArrowForEdges(dimensions.arrowOffsetLeft, dimensions.offsetLeft, dimensions.width, dimensions.anchorWidth, dimensions.windowWidth));
      },

      adjustVerticalPosition: function() {
        var dimensions = getProperties(this, 'arrowOffsetTop', 'offsetTop', 'height', 'anchorHeight', 'windowHeight');
        set(this, 'offsetTop', adjustForEdges(dimensions.offsetTop, dimensions.height, dimensions.anchorHeight, dimensions.windowHeight));
        set(this, 'arrowOffsetTop', adjustArrowForEdges(dimensions.arrowOffsetTop, dimensions.offsetTop, dimensions.height, dimensions.anchorHeight, dimensions.windowHeight));
      }
    });

    // Given the bounding dimensions, return the origin top/left component that keeps the popover in the frame
    function adjustForEdges(start, box, anchor, frame) {
      var end = start - (box / 2 - anchor / 2);

      if (end < 0) {
        end = 0;
      }
      if (end + box > frame) {
        end = frame - box;
      }

      return end;
    }

    // Given the bounding dimensions, give the origin top/left component that keeps the arrow over the anchor regardless of the popover position
    function adjustArrowForEdges(arrowStart, start, box, anchor, frame) {
      var end = start - (box / 2 - anchor / 2);
      var arrowEnd = arrowStart;

      if (end < 0) {
        arrowEnd = start + anchor / 2;
      }
      if (end + box > frame) {
        arrowEnd = box - (frame - start) + anchor / 2;
      }

      return arrowEnd;
    }
  });
define("lytics-components/display/templates/popover",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<span class=\"arrow\"></span>\n\n");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      
    });
  });
define("lytics-components/display/tip",
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
    var observer = __dependency4__.observer;
    var computed = __dependency4__.computed;
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

      togglePopover: observer('active', function() {
        set(get(this, 'popover'), 'active', get(this, 'active'));
      }),

      label: computed(function() {
        return get(this.componentsForType('label'), 'firstObject');
      }).property(),

      popover: computed(function() {
        return get(this.componentsForType('popover'), 'firstObject');
      }).property(),

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

      // Verify dependencies and auto-set options on child popover
      didRegisterComponents: function() {
        this._super();

        var labelsLength = get(this.componentsForType('label'), 'length');
        var popoversLength = get(this.componentsForType('popover'), 'length');
        assert(String.fmt("The '%@' component must have a single 'lio-label' and a single 'lio-popover'", [ get(this, 'tagName') ]), labelsLength === 1 && popoversLength === 1);

        set(get(this, 'popover'), 'anchor', get(this, 'label').$());
        set(get(this, 'popover'), 'alignToParent', true);
      }
    });
  });
define("lytics-components/input/multi-select",
  ["../namespace","../mixin/parent","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ParentComponentMixin = __dependency2__["default"] || __dependency2__;
    var A = __dependency3__.A;
    var Component = __dependency3__.Component;
    var get = __dependency3__.get;
    var set = __dependency3__.set;
    var computed = __dependency3__.computed;
    var observer = __dependency3__.observer;
    var run = __dependency3__.run;
    var assert = __dependency3__.assert;

    var typeKey = 'multi-select';

    /**
      Multi Select Component

      This component selects multiple values from a set of options. The `values`
      attribute is an array of values that is kept in sync with the `value`
      attributes of all options in the selected state. There are two actions for
      bulk updating the selected state of options: `select-all` and `unselect-all`.

      ```handlebars
      {{#lio-multi-select}}
        {{#lio-option value="one"}}One{{/lio-option}}
        {{#lio-option value="two"}}Two{{/lio-option}}
        {{#lio-option value="three"}}Three{{/lio-option}}

        {{lio-button action="select-all"}}
        {{lio-button action="unselect-all"}}
      {{/lio-multi-select}}
      ```
    */
    __exports__["default"] = Component.extend(ParentComponentMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      classNameBindings: [ 'disabled' ],

      //
      // Handlebars Attributes
      //

      disabled: false,

      values: null,

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'option', 'button', 'filter' ],

      isDisabled: computed.readOnly('disabled'),

      allOptionComponents: computed.filterBy('components', 'typeKey', 'option'),

      optionComponents: computed.filterBy('allOptionComponents', 'unselect', false),

      filteredComponents: computed.readOnly('optionComponents'),

      optionCount: computed.readOnly('optionComponents.length'),

      selectedOptionCount: computed.readOnly('values.length'),

      selectAllButton: computed(function() {
        return this.componentsForType('button').findBy('action', 'select-all');
      }).property('components.[]'),

      unselectAllButton: computed(function() {
        return this.componentsForType('button').findBy('action', 'unselect-all');
      }).property('components.[]'),

      //
      // Internal Actions
      //

      actions: {
        selectAll: function() {
          this.runAction(function() {
            this.suspendOptionObservers(function() {
              get(this, 'optionComponents').invoke('set', 'selected', true);
            });
            this.syncValues();
          });
        },

        unselectAll: function() {
          this.runAction(function() {
            this.suspendOptionObservers(function() {
              get(this, 'optionComponents').invoke('set', 'selected', false);
            });
            this.syncValues();
          });
        },

        select: function(optionValue, selectedState) {
          this.runAction(function() {
            var option = get(this, 'optionComponents').findBy('value', optionValue);

            if (selectedState === undefined) {
              selectedState = true;
            }

            option && set(option, 'selected', selectedState);
          });
        }
      },

      runAction: function(callback) {
        if (get(this, 'isDisabled')) { return; }

        run(this, callback);

        this.sendAction('action', get(this, 'values'));
      },

      //
      // Hooks / Observers
      //

      // Sync initial state of values/options
      didRegisterComponents: function() {
        this._super();

        assert("Options in '" + get(this, 'tagName') + "' components cannot contain duplicate values.", get(this, 'optionComponents').length === A(get(this, 'optionComponents').mapBy('value')).uniq().length);

        // If `values` is set, use it as the source of truth, otherwise use the
        // `selected` state of option components
        if (get(this, 'values')) {
          this.syncOptions();
        } else {
          this.syncValues();
        }

        this.setButtonState();
      },

      updateValues: observer('optionComponents.@each.{isSelected,value}', function(obj, key) {
        if (this._suspendOptionObservers || get(this, 'isInitializing')) { return; }

        this.syncValues();
      }),

      updateOptions: observer('values.[]', function() {
        if (get(this, 'isInitializing')) { return; }

        this.suspendOptionObservers(function() {
          this.syncOptions();
        });

        this.setButtonState();
      }),

      // Update values to reflect the `selected` state of all options
      syncValues: function() {
        var selectedOptions = A(get(this, 'optionComponents').filterBy('isSelected'));

        // The `values` attribute must be set to a new array reflecting the state
        // of selected options; manipulating the array is not compatible with
        // bindings that point to computed properties
        set(this, 'values', A(selectedOptions.mapBy('value')));
      },

      // Update the `selected` state of all options to reflect current values
      syncOptions: function() {
        var options = get(this, 'allOptionComponents');
        var values = A(get(this, 'values') || []);

        assert("The 'value' attribute of '" + get(this, 'tagName') + "' components must not contain duplicate values.", get(values, 'length') === get(values.uniq(), 'length'));

        options.forEach(function(option) {
          set(option, 'selected', values.contains(get(option, 'value')));
        });
      },

      // Disable/enable action buttons
      setButtonState: function() {
        var total = get(this, 'optionCount');
        var selected = get(this, 'selectedOptionCount');
        var selectAllButton = get(this, 'selectAllButton');
        var unselectAllButton = get(this, 'unselectAllButton');

        selectAllButton && set(selectAllButton, 'disabled', selected === total);
        unselectAllButton && set(unselectAllButton, 'disabled', selected === 0);
      },

      // Temporarily prevent option observers from having an effect to allow for
      // batch option updates
      suspendOptionObservers: function(callback) {
        this._suspendOptionObservers = true;
        callback.call(this);
        this._suspendOptionObservers = false;
      }
    });
  });
define("lytics-components/input/toggle",
  ["../namespace","../mixin/parent","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var tagForType = __dependency1__.tagForType;
    var ParentComponentMixin = __dependency2__["default"] || __dependency2__;
    var Component = __dependency3__.Component;
    var get = __dependency3__.get;
    var set = __dependency3__.set;
    var run = __dependency3__.run;
    var computed = __dependency3__.computed;
    var assert = __dependency3__.assert;

    var typeKey = 'toggle';

    /**
      Toggle Component

      This component switches its value between two options. The possible values
      are taken from the `value` attribute of each option. When the component is
      'toggled', its value is changed to that of the next option.  At any given
      time the option with the value that matches the component's is marked as
      active.

      ```handlebars
      {{#lio-toggle defaultValue=false}}
        {{#lio-option value=true}}Yes{{/lio-option}}
        {{#lio-option value=false}}No{{/lio-option}}
      {{/lio-toggle}}
      ```
    */
    __exports__["default"] = Component.extend(ParentComponentMixin, {
      //
      // HTML Properties
      //

      tagName: tagForType(typeKey),

      classNameBindings: [ 'valueClass', 'disabled' ],

      //
      // Handlebars Attributes
      //

      disabled: false,

      defaultValue: false,

      value: computed.oneWay('defaultValue'),

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'option' ],

      valueClass: computed(function() {
        return '' + get(this, 'value');
      }).property('value'),

      possibleValues: computed(function() {
        return this.componentsForType('option').mapBy('value');
      }).property('components.[]'),

      //
      // Internal Actions
      //

      actions: {
        toggle: function() {
          if (!get(this, 'disabled')) {
            run(this, function() {
              var current = get(this, 'value');
              var possible = get(this, 'possibleValues');
              var nextIndex = possible.indexOf(current) + 1;

              // Wrap around to the first value
              if (nextIndex === get(possible, 'length')) {
                nextIndex = 0;
              }

              set(this, 'value', possible[nextIndex]);
            });

            this.sendAction('action', get(this, 'value'));
          }
        }
      },

      //
      // Event Handlers
      //

      click: function() {
        this.send('toggle');
      },

      keyPress: function(event) {
        if (event.which === 13) {
          this.send('toggle');
        }
      },

      //
      // Hooks / Observers
      //

      // Verify dependencies and initialize the default value
      didRegisterComponents: function() {
        this._super();

        assert("The '" + get(this, 'tagName') + "' component must contain at exactly two 'lio-option' components.", get(this.componentsForType('option'), 'length') === 2);

        var value = get(this, 'value');
        var defaultValue = get(this, 'defaultValue');

        // Only set the default if there's currently no value
        if (value === undefined && defaultValue !== undefined) {
          set(this, 'value', defaultValue);
        }
      }
    });
  });
define("lytics-components",
  ["./mixin/parent","./mixin/child","./mixin/active-state","./mixin/transition","./common/option","./common/button","./common/content","./common/label","./common/text-field","./common/filter","./display/carousel","./display/popover","./display/templates/popover","./display/tip","./input/toggle","./input/multi-select","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __dependency10__, __dependency11__, __dependency12__, __dependency13__, __dependency14__, __dependency15__, __dependency16__, __dependency17__, __exports__) {
    "use strict";
    var ParentComponentMixin = __dependency1__["default"] || __dependency1__;
    var ChildComponentMixin = __dependency2__["default"] || __dependency2__;
    var ActiveStateMixin = __dependency3__["default"] || __dependency3__;
    var TransitionMixin = __dependency4__["default"] || __dependency4__;
    var OptionComponent = __dependency5__["default"] || __dependency5__;
    var ButtonComponent = __dependency6__["default"] || __dependency6__;
    var ContentComponent = __dependency7__["default"] || __dependency7__;
    var LabelComponent = __dependency8__["default"] || __dependency8__;
    var TextFieldComponent = __dependency9__["default"] || __dependency9__;
    var FilterComponent = __dependency10__["default"] || __dependency10__;
    var CarouselComponent = __dependency11__["default"] || __dependency11__;
    var PopoverComponent = __dependency12__["default"] || __dependency12__;
    var PopoverTemplate = __dependency13__["default"] || __dependency13__;
    var TipComponent = __dependency14__["default"] || __dependency14__;
    var ToggleComponent = __dependency15__["default"] || __dependency15__;
    var MultiSelectComponent = __dependency16__["default"] || __dependency16__;
    var Application = __dependency17__.Application;

    Application.initializer({
      name: 'lyticsComponents',
      initialize: function(container, application) {
        application.register('component:lio-option', OptionComponent);
        application.register('component:lio-button', ButtonComponent);
        application.register('component:lio-content', ContentComponent);
        application.register('component:lio-label', LabelComponent);
        application.register('component:lio-text-field', TextFieldComponent);
        application.register('component:lio-filter', FilterComponent);
        application.register('component:lio-carousel', CarouselComponent);
        application.register('component:lio-popover', PopoverComponent);
        application.register('template:components/lio-popover', PopoverTemplate);
        application.register('component:lio-tip', TipComponent);
        application.register('component:lio-toggle', ToggleComponent);
        application.register('component:lio-multi-select', MultiSelectComponent);
      }
    });

    __exports__.ParentComponentMixin = ParentComponentMixin;
    __exports__.ChildComponentMixin = ChildComponentMixin;
    __exports__.ActiveStateMixin = ActiveStateMixin;
    __exports__.TransitionMixin = TransitionMixin;
    __exports__.OptionComponent = OptionComponent;
    __exports__.ButtonComponent = ButtonComponent;
    __exports__.ContentComponent = ContentComponent;
    __exports__.LabelComponent = LabelComponent;
    __exports__.TextFieldComponent = TextFieldComponent;
    __exports__.FilterComponent = FilterComponent;
    __exports__.CarouselComponent = CarouselComponent;
    __exports__.PopoverComponent = PopoverComponent;
    __exports__.TipComponent = TipComponent;
    __exports__.ToggleComponent = ToggleComponent;
    __exports__.MultiSelectComponent = MultiSelectComponent;
  });
define("lytics-components/mixin/active-state",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Mixin = __dependency1__.Mixin;
    var get = __dependency1__.get;
    var set = __dependency1__.set;
    var computed = __dependency1__.computed;
    var observer = __dependency1__.observer;

    __exports__["default"] = Mixin.create({
      //
      // HTML Properties
      //

      classNameBindings: [ 'isVisuallyActive:active:inactive' ],

      //
      // Handlebars Attributes
      //

      active: false,

      //
      // Internal Properties
      //

      isActive: computed.readOnly('active'),

      // Boolean indicating whether the component should appear as active
      isVisuallyActive: null,

      //
      // Internal Actions
      //

      actions: {
        activate: function() {
          set(this, 'active', true);
        },

        deactivate: function() {
          set(this, 'active', false);
        },

        toggleActive: function() {
          this.send(get(this, 'active') ? 'deactivate' : 'activate');
        }
      },

      //
      // Hooks / Observers
      //

      // Initialize the `isVisuallyActive` flag to the initial value of `active`; it
      // can't use `computed.oneWay` because the value must always act independently
      // (since it is managed by the function below).
      init: function() {
        this._super();

        set(this, 'isVisuallyActive', get(this, 'isActive'));
      },

      // Begin a transition that ends with setting the visual state to the current state
      transitionVisualState: observer('isActive', function() {
        var isActive = this.get('isActive');

        // The component may not use transitions
        if (this.withTransition) {
          this.withTransition(isActive ? 'activating' : 'deactivating', function() {
            set(this, 'isVisuallyActive', isActive);
          });
        } else {
          set(this, 'isVisuallyActive', isActive);
        }
      })
    });
  });
define("lytics-components/mixin/child",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Mixin = __dependency1__.Mixin;
    var EmberArray = __dependency1__.A;
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;
    var assert = __dependency1__.assert;

    __exports__["default"] = Mixin.create({
      //
      // Internal Properties
      //

      parent: computed.alias('parentView'),

      //
      // Hooks / Observers
      //

      // Register self with parent component
      willInsertElement: function(view) {
        this._super(view);

        var parent = get(this, 'parent');

        if (!get(this, 'canBeTopLevel')) {
          assert("The '" + get(this, 'tagName') + "' component must be nested underneath another component'", parent && parent.registerComponent);
        }

        parent && parent.registerComponent && parent.registerComponent(this);
      },

      // Notify parent of insertion into DOM
      didInsertElement: function(view) {
        this._super(view);

        var parent = get(this, 'parent');
        parent && parent.didInsertComponent && parent.didInsertComponent(this);
      }
    });
  });
define("lytics-components/mixin/parent",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Mixin = __dependency1__.Mixin;
    var A = __dependency1__.A;
    var get = __dependency1__.get;
    var set = __dependency1__.set;
    var assert = __dependency1__.assert;

    __exports__["default"] = Mixin.create({
      //
      // Internal Properties
      //

      concatenatedProperties: [ 'allowedComponents' ],

      allowedComponents: [],

      isInitializing: true,

      components: null,

      //
      // Hooks / Observers
      //

      init: function() {
        this._super();

        set(this, 'components', A());
      },

      //
      // Internal Methods
      //

      registerComponent: function(component) {
        var type = get(component, 'typeKey');
        var allowed = get(this, 'allowedComponents');

        assert("All registered components must have a `typeKey` property, got '" + type + "'", typeof type === 'string');
        assert("A '" + get(component, 'tagName') + "' component cannot be nested within a '" + get(this, 'tagName') + "' component.", A(allowed).contains(type));

        get(this, 'components').pushObject(component);
      },

      // Hook stub to allow uses of `_super`
      didRegisterComponents: Ember.K,

      didInsertComponent: function() {
        // Once a component is actually in the DOM, we know that all components have been registered
        if (get(this, 'isInitializing')) {
          this.trigger('didRegisterComponents');
          set(this, 'isInitializing', false);
        }
      },

      componentsForType: function(type) {
        return A(get(this, 'components').filterBy('typeKey', type));
      }
    });
  });
define("lytics-components/mixin/transition",
  ["../browser","ember","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var testTrasitionSupport = __dependency1__.testTrasitionSupport;
    var RSVP = __dependency2__.RSVP;
    var Mixin = __dependency2__.Mixin;
    var A = __dependency2__.A;
    var get = __dependency2__.get;
    var set = __dependency2__.set;
    var computed = __dependency2__.computed;
    var run = __dependency2__.run;
    var $ = __dependency2__.$;

    // Test transition support once, then check the exported value in `$.support.transition`
    testTrasitionSupport();

    __exports__["default"] = Mixin.create({
      //
      // Handlebars Attributes
      //

      // Any component can override this property to never use transitions,
      // otherwise it defaults to the parent component's value
      disableTransitions: computed(function() {
        return get(this, 'parent.disableTransitions') === true;
      }).property(),

      //
      // Internal Properties
      //

      // Whether the component is in the middle of a transition
      isTransitioning: false,

      // This class gets added in order to trigger the actual transition
      transitionTriggerClass: 'trigger',

      // An optional class that gets added to prime a transition, used internally
      transitionClass: null,

      //
      // Hooks / Observers
      //

      // Normalize the 'transitionend' event by setting up an Ember event to fire
      // when the DOM event fires; this is primarily for testing purposes
      didInsertElement: function(view) {
        this._super(view);

        var component = this;

        if ($.support.transition) {
          this.$().on($.support.transition.end, function(event) {
            // This code is async and ember-testing requires us to wrap any code
            // with asynchronous side-effects in an Ember.run
            run(component, 'trigger', 'transitionDidEnd');

            // Don't bubble the DOM event and cause other components to receive
            // a false transition end event
            return false;
          });
        }
      },

      //
      // Internal Methods
      //

      // Encapsulate a transition; the callback gets run regardless of support
      withTransition: function(transitionClass, callback) {
         // Don't perform transitions if they are not supported, they are explicitly disabled,
         // or the component's parent hasn't finished initializing
         if ($.support.transition && !get(this, 'disableTransitions') && !get(this, 'parent.isInitializing')) {
          var currentTransition = get(this, 'currentTransition');

          // If a transition is currently running, abort it first
          if (currentTransition) {
            currentTransition.abort();
          }

          var transition = new Transition(this, transitionClass);

          set(this, 'currentTransition', transition);

          // Invoke the callback regardless of whether the transition was aborted
          transition.promise['finally'](function() {
            callback && callback.call(this);
            set(this, 'currentTransition', null);
          }.bind(this));
        } else {
          // Don't unleash Zalgo
          // TODO debt: even though this is async in the sense that it doesn't
          // invoke the callback before returning, it is still invoked in the same
          // event loop, unlike transition end events. Unfortunately changing this
          // to use `run.later` has far reaching testing implications
          callback && run(this, callback);
        }
      }
    });

    // Class for encapsulating a transition
    function Transition(component, transitionClass) {
      var deferred = RSVP.defer("Transition: '" + transitionClass + "' on component '" + component + "'");
      var triggerClass = get(component, 'transitionTriggerClass');
      var $el = component.$();
      var handleTrasitionEnd = function() {
        set(component, 'isTransitioning', false);

        // Remove all transition classes
        $el.removeClass(transitionClass + ' ' + triggerClass);

        deferred.resolve();
      };

      this.promise = deferred.promise;

      // Add the component's transition priming class if it exists
      transitionClass = A([ get(component, 'transitionClass'), transitionClass ]).compact().join(' ');

      // Add ability to abort the transition
      this.abort = function() {
        component.off('transitionDidEnd', handleTrasitionEnd);

        // This removes the transition classes which ensures that a transition
        // end event won't be received for the transition
        handleTrasitionEnd();

        deferred.reject();
      };

      // Add the end handler before the transition is started
      component.one('transitionDidEnd', handleTrasitionEnd);

      // Begin transition
      set(component, 'isTransitioning', true);

      // Add transition priming class
      $el.addClass(transitionClass);

      // Force a reflow to interrupt any transitions so the element can be
      // initialized before the real transition
      $el.get(0).offsetWidth;

      // Add class to start the transition
      $el.addClass(triggerClass);
    }
  });
define("lytics-components/namespace",
  ["exports"],
  function(__exports__) {
    "use strict";
    var namespace = 'lio';

    function tagForType(type) {
      return namespace + '-' + type;
    }

    __exports__.tagForType = tagForType;__exports__["default"] = namespace;
  });