import namespace from '../namespace';
import ParentComponentMixin from '../mixin/parent';
import {
  Component,
  get,
  set,
  computed,
  assert
} from 'ember';

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
export default Component.extend(ParentComponentMixin, {
  typeKey: typeKey,

  allowedComponents: [ 'content', 'label', 'button' ],

  tagName: namespace + '-' + typeKey,

  classNameBindings: [ 'isEmpty:empty',  'isSingle:single' ],

  actions: {
    // Activate the content at the previous index
    backward: function() {
      var activeIndex = get(this, 'activeIndex');
      var contentLength = get(this, 'contentLength');
      var nextIndex = activeIndex - 1;

      this.send('activate', nextIndex < 0 ? contentLength - 1 : nextIndex);
    },

    // Activate the content at the next index
    forward: function() {
      var activeIndex = get(this, 'activeIndex');
      var contentLength = get(this, 'contentLength');
      var nextIndex = activeIndex + 1;

      this.send('activate', nextIndex >= contentLength ? 0 : nextIndex);
    },

    // Activate the content at the given index
    activate: function(nextIndex) {
      var activeIndex = get(this, 'activeIndex');

      // Nothing to do if the given index is already active
      if (activeIndex === nextIndex) { return; }

      // Don't attempt to transition to an invalid index
      if (nextIndex < 0 || nextIndex > get(this, 'contentLength')) { return; }

      var contents = this.componentsForType('content');
      var lastContent = contents.objectAt(activeIndex);
      var nextContent = contents.objectAt(nextIndex);

      var labels = this.componentsForType('label');
      var lastLabel = labels.objectAt(activeIndex);
      var nextLabel = labels.objectAt(nextIndex);

      if (lastContent) {
        set(lastContent, 'active', false);

        if (lastLabel) {
          set(lastLabel, 'active', false);
        }
      }

      set(nextContent, 'active', true);

      if (nextLabel) {
        set(nextLabel, 'active', true);
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

  // The index of the content item currently active
  activeIndex: function() {
    var contents = this.componentsForType('content');
    var active = contents.findBy('isActive');

    return contents.indexOf(active);
  }.property('components.@each.isActive').readOnly(),

  // The number of content items in the carousel
  contentLength: function() {
    return get(this.componentsForType('content'), 'length');
  }.property('components.[]').readOnly(),

  // Whether or not the carousel has no content items
  isEmpty: computed.equal('contentLength', 0),

  // Whether or not there is only one content item
  isSingle: computed.equal('contentLength', 1),

  // Set the initially active content if none is specified
  setActiveContent: function() {
    var contents = this.componentsForType('content');

    assert("The '" + get(this, 'tagName') + "' component can only have one active 'lio-content' component.", contents.filterBy('isActive').length <= 1);

    if (!get(this, 'isEmpty') && get(this, 'activeIndex') === -1) {
      this.send('activate', 0);
    }
  }.on('didRegisterComponents'),

  // Ensure there are the same number of labels as content items and that the
  // correct label is activated initially
  verifyLabels: function() {
    var labels = this.componentsForType('label');
    var labelLength = get(labels, 'length');
    var activeIndex = get(this, 'activeIndex');

    assert("The '" + get(this, 'tagName') + "' component must have the same number of 'lio-label' components as 'lio-content' components.", !labelLength || labelLength === get(this.componentsForType('content'), 'length'));

    if (labelLength) {
      set(labels.objectAt(activeIndex), 'active', true);
    }
  }.on('didRegisterComponents')
});
