define(
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

      //
      // Internal Properties
      //

      typeKey: typeKey,

      allowedComponents: [ 'button' ],

      canBeTopLevel: true,

      renderedPosition: null,

      position: function(key, value) {
        if (arguments.length === 1) {
          return positions[0];
        } else {
          assert(String.fmt("Position must be one of %@", [ JSON.stringify(positions) ]), positions.contains(value));
          return value;
        }
      }.property(),

      offset: function() {
        return {
          top: get(this, 'offsetTop'),
          left: get(this, 'offsetLeft')
        };
      }.property('offsetTop', 'offsetLeft').readOnly(),

      arrowOffset: function() {
        return {
          top: get(this, 'arrowOffsetTop'),
          left: get(this, 'arrowOffsetLeft')
        };
      }.property('arrowOffsetTop', 'arrowOffsetLeft').readOnly(),

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

      resizeHelper: function() {
        set(this, 'resizeHandler', $(window).on('resize', function() {
          this.reposition();
        }.bind(this)));
      }.on('didInsertElement'),

      willDestroy: function() {
        this._super();
        $(window).unbind('resize', this.get('resizeHandler'));
      },

      //
      // Internal Methods
      //

      adjustPosition: function() {
        var position = get(this, 'position');
        var dimensions = getProperties(this, 'offsetLeft', 'width', 'anchorWidth', 'windowWidth', 'offsetTop', 'height', 'anchorHeight', 'windowHeight');

        // The rendered position is the opposite of the preferred position when there is no room where preferred
        if (position == 'left' && dimensions.offsetLeft - dimensions.width < 0) {
          position = 'right';
        } else if (position == 'right' && dimensions.offsetLeft + dimensions.width + dimensions.anchorWidth > dimensions.windowWidth) {
          position = 'left';
        } else if (position == 'top' && dimensions.offsetTop - dimensions.height < 0) {
          position = 'bottom';
        } else if (position == 'bottom' && dimensions.offsetTop + dimensions.height + dimensions.anchorHeight > dimensions.windowHeight) {
          position = 'top';
        }

        set(this, 'renderedPosition', position);
      },

      reposition: function() {
        if (get(this, 'active')) {
          var $el = this.$();
          var $arrow = $el.find('.arrow');
          var $anchor = $(get(this, 'anchor'));
          var anchorOffset = $anchor.offset() || { top: 0, left: 0 };

          setProperties(this, {
            offsetTop: anchorOffset.top,
            offsetLeft: anchorOffset.left,

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
      }.observes('position', 'active'),

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