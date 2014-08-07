import { tagForType } from '../namespace';
import ParentComponentMixin from '../mixin/parent';
import {
  Component,
  Object,
  String,
  get,
  set,
  assert
} from 'ember';

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
export default Component.extend(ParentComponentMixin, {
  typeKey: typeKey,

  allowedComponents: [ 'content', 'popover', 'label' ],

  tagName: tagForType(typeKey),

  classNameBindings: [ 'active', 'inactive' ],

  active: false,

  inactive: Ember.computed.not('active').readOnly(),

  activator: 'click',

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

  click: function(event) {
    if (get(this, 'fromFocus')) {
      set(this, 'fromFocus', false);
      return;
    }
    if (get(this, 'activator') === 'click') {
      this.send('toggle');
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

  actions: {
    activate: function() {
      set(this, 'active', true);
    },
    deactivate: function() {
      set(this, 'active', false);
    },
    toggle: function() {
      this.toggleProperty('active');
    }
  },

  keyPress: function(event) {
    if (event.which === 13) {
      this.send('toggle');
    } else if (event.which === 27) {
      this.send('deactivate');
    }
  },

  verifyContents: function() {
    var labelsLength = get(this.componentsForType('label'), 'length');
    var popoversLength = get(this.componentsForType('popover'), 'length');
    assert(String.fmt("The '%@' component must have a single 'lio-label' and a single 'lio-popover'", [ get(this, 'tagName') ]), labelsLength === 1 && popoversLength === 1);

    set(get(this, 'popover'), 'anchor', get(this, 'label').$());
  }.on('didRegisterComponents')
});
