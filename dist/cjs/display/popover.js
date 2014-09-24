"use strict";
var tagForType = require("../namespace").tagForType;
var ParentComponentMixin = require("../mixin/parent")["default"] || require("../mixin/parent");
var ChildComponentMixin = require("../mixin/child")["default"] || require("../mixin/child");
var ActiveStateMixin = require("../mixin/active-state")["default"] || require("../mixin/active-state");
var TransitionMixin = require("../mixin/transition")["default"] || require("../mixin/transition");
var A = require("ember").A;
var Component = require("ember").Component;
var String = require("ember").String;
var get = require("ember").get;
var set = require("ember").set;
var setProperties = require("ember").setProperties;
var getProperties = require("ember").getProperties;
var computed = require("ember").computed;
var observer = require("ember").observer;
var assert = require("ember").assert;

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
exports["default"] = Component.extend(ParentComponentMixin, ChildComponentMixin, ActiveStateMixin, TransitionMixin, {
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