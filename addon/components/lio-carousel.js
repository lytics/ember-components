import { tagForType } from '../util/namespace';
import ParentComponentMixin from '../mixins/parent';
import Ember from 'ember';

const Component = Ember.Component;
const get       = Ember.get;
const set       = Ember.set;
const computed  = Ember.computed;
const assert    = Ember.assert;

const typeKey = 'carousel';

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
export default Component.extend(ParentComponentMixin, {
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
    const contents = this.componentsForType('content');
    const active = contents.findBy('isActive');

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
      const activeIndex = get(this, 'activeIndex');
      const contentLength = get(this, 'contentLength');
      const nextIndex = activeIndex - 1;

      this.send('activate', nextIndex < 0 ? contentLength - 1 : nextIndex, 'backward');
    },

    // Activate the content at the next index
    forward: function() {
      const activeIndex = get(this, 'activeIndex');
      const contentLength = get(this, 'contentLength');
      const nextIndex = activeIndex + 1;

      this.send('activate', nextIndex >= contentLength ? 0 : nextIndex, 'forward');
    },

    // Activate the content at the given index
    activate: function(nextIndex, direction) {
      const activeIndex = get(this, 'activeIndex');

      // Nothing to do if the given index is already active
      if (activeIndex === nextIndex) { return; }

      // Don't attempt to transition to an invalid index
      if (nextIndex < 0 || nextIndex > get(this, 'contentLength')) { return; }

      const contents = this.componentsForType('content');
      const labels = this.componentsForType('label');
      const activeContent = contents.objectAt(activeIndex);

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
      const labels = this.componentsForType('label');
      const nextIndex = labels.indexOf(label);

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

    const contents = this.componentsForType('content');
    const firstContent = contents.objectAt(0);

    assert("The '" + get(this, 'tagName') + "' component can only have one active 'lio-content' component.", contents.filterBy('isActive').length <= 1);

    if (!get(this, 'isEmpty') && get(this, 'activeIndex') === -1) {
      firstContent.send('activate');
    }

    const labels = this.componentsForType('label');
    const labelLength = get(labels, 'length');
    const activeIndex = get(this, 'activeIndex');

    assert("The '" + get(this, 'tagName') + "' component must have the same number of 'lio-label' components as 'lio-content' components.", !labelLength || labelLength === get(this.componentsForType('content'), 'length'));

    if (labelLength) {
      labels.objectAt(activeIndex).send('activate');
    }
  }
});
