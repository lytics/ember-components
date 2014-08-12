import {
  Mixin,
  get,
  set,
  computed
} from 'ember';

export default Mixin.create({
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
  initVisuallyActive: function() {
    set(this, 'isVisuallyActive', get(this, 'isActive'));
  }.on('init'),

  // Begin a transition that ends with setting the visual state to the current state
  transitionVisualState: function() {
    var isActive = this.get('isActive');

    // The component may not use transitions
    if (this.withTransition) {
      this.withTransition(isActive ? 'activating' : 'deactivating', function() {
        set(this, 'isVisuallyActive', isActive);
      });
    } else {
      set(this, 'isVisuallyActive', isActive);
    }
  }.observes('isActive')
});
