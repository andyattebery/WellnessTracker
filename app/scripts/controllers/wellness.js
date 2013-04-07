Clementine.add('wt.controllers', function(exports) {

  var ViewController        = Clementine.ViewController;
  
  var NavigationController  = include('ui').NavigationController;
  
  var WellnessViewModel     = include('wt.models').WellnessViewModel;
  var LoginViewModel        = include('wt.models').LoginViewModel;

  /**
   @class WellnessController
   @extends NavigationController
  */
  var WellnessController = NavigationController.extend({
    
    initialize: function(parent, target, app) {

      this.model = new WellnessViewModel(app.getService('wt'));
    
      this._super(parent, target, app);
    
    },
    
    // Configuration
    
    getType: function() {
      return 'wellness';
    },
    
    getOutlets: function() {
      return ['login', 'goals'];
    },
    
    getBindings: function() {
      return {
        'login': { 'login': this.onLogin }
      };
    },
    
    // Event Listeners
    
    onLogin: function(e) {
      e.stopPropagation();
    }
    
  });
  
  /**
   @class LoginController
   @extends ViewController
   @fires login
  */
  var LoginController = ViewController.extend({
  
    initialize: function(parent, target, app) {

      this.model = new LoginViewModel(app.getService('wt'));
    
      this._super(parent, target, app);
    
    },
  
    // Configuration
  
    getType: function() {
      return 'login';
    },
    
    getOutlets: function() {
      return ['email-field', 'login-btn'];
    },
    
    getBindings: function() {
      return {
        'email-field': { 'keypress': this.$onKeyPress },
        'login-btn': { 'touchclick': this.$onLogin }
      };
    },
    
    // DOM Listeners
    
    $onKeyPress: function(e) {
      e.stopPropagation();
    },
    
    $onLogin: function(e) {
      e.stopPropagation();
    }
  
  });
  
  /**
   @class GoalsController
   @extends ViewController
  */
  var GoalsController = ViewController.extend({
    
    initialize: function(parent, target, app) {
    
      this.model = new GoalsViewModel(app.getService('wt'));
    
      this._super(parent, target, app);
    
    },
    
    getType: function() {
      return 'goals';
    },
    
    getOutlets: function() {
      return ['goal-setup', 'goal-forms(.goal)', 'update-btn'];
    },
    
    getBindings: function() {
      return {
        'goal-setup': { 'close': this.onClose, 'save': this.onSave },
        'goal-forms(.set)': { 'touchclick': this.$onSet },
        'update-btn': { 'touchclick': this.$onUpdate } 
      };
    },
    
    setup: function() {
      this.addView(GoalSetupController, 'goal-setup', 'goal-setup', 'goal-setup.html', 'body');
    },
    
    // Event Listeners
    
    onClose: function(e) {
      e.stopPropagation();
    },
    
    onSave: function(e) {
      e.stopPropagation();
    },
    
    // DOM Listeners
    
    $onSet: function(e) {
      e.stopPropagation();
    },
    
    $onUpdate: function(e) {
      e.stopPropagation();
    }
    
  });
  
  /**
   @class GoalSetupController
   @extends NavigationController
   @bubbles close
   @fires save
  */
  var GoalSetupController = NavigationController.extend({
    
    getType: function() {
      return 'goal-setup';
    },
    
    getOutlets: function() {
      return ['goal-chooser', 'goal-editor'];
    },
    
    getBindings: function() {
      return {
        'goal-choose': { 'select': this.onSelect },
        'goal-editor': { 'back': this.onBack }
      };
    },
    
    // Event Listeners
    
    onBack: function(e) {
      e.stopPropagation();
    },
    
    onSelect: function(e) {
      e.stopPropagation();
    }
    
  });
  
  /**
   @class GoalChooserController
   @extends ItemListController
   @fires close, select
  */
  var GoalChooserController = ViewController.extend({
    
    getType: function() {
      return 'goal-chooser';
    },
    
    getOutlets: function() {
      return ['close-btn'];
    },
    
    getBindings: function() {
      return {
        'close-btn': this.$onClose,
        'list(li)': this.$onSelect
      };
    },
    
    // Public Methods
    
    setData: function(data) {
      this.data = data;
    },
    
    render: function() {
    
    },
    
    clear: function() {
    
    },
    
    // DOM Listeners
    
    $onSelect: function(e) {
      e.stopPropagation();
    },
    
    $onClose: function(e) {
      e.stopPropagation();
    }
    
  });
  
  /**
   @class GoalEditorController
   @extends ViewController
   @fires back, save
  */
  var GoalEditorController = ViewController.extend({
    
    getType: function() {
      return 'goal-editor';
    },
    
    getOutlets: function() {
      return ['back-btn', 'goal-name', 'goal-category', 'custom-field', 'unit-field', 'custom-unit-field', 'value-field', 'save-btn'];
    },
    
    getBindings: function(e) {
      return {
        'back-btn': { 'touchclick': this.$onBack },
        'save-btn': { 'touchclick': this.$onSave }
      };
    },
    
    // DOM Listeners
    
    $onBack: function(e) {
      e.stopPropagation();
    },
    
    $onSave: function(e) {
      e.stopPropagation();
    }
    
  });
  
  exports.WellnessController    = WellnessController;
  exports.LoginController       = LoginController;
  exports.GoalsController       = GoalsController;
  exports.GoalSetupController   = GoalSetupController;
  exports.GoalChooserController = GoalChooserController;
  exports.GoalEditorController  = GoalEditorController;

}, ['ui', 'wt.controllers.list']);