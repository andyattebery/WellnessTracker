Clementine.add('wt.controllers', function(exports) {

  var ViewController        = Clementine.ViewController;
  
  var NavigationController  = include('ui').NavigationController;
  var ModalViewController   = include('ui').ModalViewController;
  
  var WellnessViewModel     = include('wt.models').WellnessViewModel;
  var LoginViewModel        = include('wt.models').LoginViewModel;
  var GoalsViewModel        = include('wt.models').GoalsViewModel;
  
  /**
   @class WellnessController
   @extends NavigationController
  */
  var WellnessController = NavigationController.extend({
    
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
    
    // State Handlers
    
    onWillLoad: function() {
      ErrorHandler.init();      
      this._super();
    },
    
    // Event Listeners
    
    onLogin: function(e) {
      
      e.stopPropagation();
            
      this.getView('goals').setUserId(e.data);
      this.pushView('goals');
      
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
    
    // State Handlers
    
    onDidAppear: function() {
      
      var userId = localStorage.getItem('wellness_uid');
    
      if (userId) {
        this.fire('login', userId);
      }
      
      this._super();
      
    },
    
    // DOM Listeners
    
    $onKeyPress: function(e) {
      e.stopPropagation();
      var code = (e.keyCode ? e.keyCode : e.which);
      if (code === 13) {
        e.preventDefault();
        this.getElement('email-field').blur();
        this.$onLogin();
      }
    },
    
    $onLogin: function(e) {
      
      e.stopPropagation();
      
      var email = this.getElement('email-field'), that = this;
    
      this.model.loginUser(email).then(function(user) {
        that.fire('login', user.id);        
      }, function() {
        ErrorHandler.show('Could not login');
      });
    
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
        'modal-view': { 'close': this.onClose, 'save': this.onSave },
        'goal-forms(.set)': { 'touchclick': this.$onSet },
        'goal-forms(.value-field)': { 'blur': this.$onBlur },
        'update-btn': { 'touchclick': this.$onUpdate } 
      };
    },
    
    setup: function() {
      this.addView(ModalViewController, 'modal-view', 'modal-view', 'goal-setup.html', 'body');
    },
    
    // State Handlers
    
    onWillLoad: function() {
    
      var that = this;
                
      this.categoriesRequest = this.model.getCategories().then(function(categories) {
        that.renderCategories(categories);
      }, function() {
        ErrorHandler.show('Could not load categories');
      });
      
      this.getElement('update-btn').hide();
      
      this._super();
    
    },
    
    // Public Methods
    
    setUserId: function(userId) {
        
      var that = this;
    
      var goalsRequest = this.model.getUserGoals(userId);
      
      $.when(goalsRequest, this.categoriesRequest).then(function(goals) {
        setTimeout(function() {
          that.renderGoals(goals);
        }, 0);
      }, function() {
        ErrorHandler.show('Error fetching goals');
      });
    
    },
    
    renderCategories: function(categories) {
            
      var that = this;
      
      var goals = this.getElement('goal-forms');
      goals.empty();
      
      _.each(categories, function(category) {
        
        var el = $('<li class="goal-item unset" itemid="' + category.id + '"></li>');
        el.append('<div class="goal-title">' + category.name + '</div>');
        el.append('<div class="goal-name"></div>');
        el.append('<div class="goal-value"></div>');
        el.append('<div class="goal-unit"></div>');
        el.append('<input type="text" class="value-field" name="value" />');
        el.append('<input type="button" class="set-goal-btn set" value="Set Goal" />');
        
        el.find('.goal-name').hide();
        el.find('.goal-value').hide();
        el.find('.goal-unit').hide();
        el.find('.value-field').hide();
        
        goals.append(el);
        
      });
      
    },
    
    renderGoals: function(goals) {
          
      var goalsEl = this.getElement('goal-forms');
                  
      _.each(goals, function(goal) {
      
        var el = goalsEl.find('.goal-item[itemid="' + goal.selectedGoal.category.id + '"]');
        
        el.removeClass('unset');
        el.find('.goal-name').text(goal.selectedGoal.name).attr('itemid', goal.selectedGoal.id);
        el.find('.goal-value').text(goal.targetValue);
        el.find('.goal-unit').text(goal.selectedUnit.name);
        el.find('[type="button"]').hide();
        
        el.find('.goal-name').show();
        el.find('.goal-value').show();
        el.find('.goal-unit').show();
        el.find('.value-field').show();
      
      });
    
    },
    
    // Event Listeners
    
    onClose: function(e) {
      e.stopPropagation();
      this.getView('modal-view').dismissModalView();
    },
    
    onSave: function(e) {
      
      e.stopPropagation();
      
      var goal = e.data, that = this;
      
      function success(userGoal) {
                
        var el = that.getElement('goal-forms').find('.goal-item[itemid="' + userGoal.selectedGoal.category.id + '"]');
                
        el.removeClass('unset');
        el.find('.goal-name').text(userGoal.selectedGoal.name).attr('itemid', userGoal.selectedGoal.id);
        el.find('.goal-value').text(userGoal.targetValue);
        el.find('.goal-unit').text(userGoal.selectedUnit.name);
        el.find('[type="button"]').hide();
        
        el.find('.goal-name').show();
        el.find('.goal-value').show();
        el.find('.goal-unit').show();
        el.find('.value-field').show();
      
        that.getView('modal-view').dismissModalView();
        
      }
      
      function failure() {
        ErrorHandler.show('Could not set goal');
        that.getView('modal-view').dismissModalView();
      }
            
      if (goal.customField.length > 0) {
        this.model.saveCustomGoal(goal.categoryId, goal.goalId, goal.targetValue, goal.customField, goal.customUnitField).then(success, failure);
      } else {
        this.model.saveGoal(goal.categoryId, goal.goalId, goal.unitId, goal.targetValue).then(success, failure);
      }
      
    },
    
    // DOM Listeners
    
    $onSet: function(e) {
    
      e.stopPropagation();
      
      var categoryId = $(e.currentTarget).closest('.goal-item').attr('itemid'), that = this;
            
      this.model.getGoalsForCategory(categoryId).then(function(data) {
        that.getView('modal-view').getView('goal-setup').setData(data);
        that.getView('modal-view').presentModalView();
      }, function() {
        ErrorHandler.show('Could not load goals for category');
      });
      
    },
    
    $onBlur: function(e) {
      
      e.stopPropagation();
      
      var filled = 0;
      
      this.find('.value-field').each(function() {
      
        var value = $(this).val();
        
        if (value && value.length > 0) {
          filled++;
        }
      
      });
      
      if (filled === 4) {
        this.getElement('update-btn').show();
      } else {
        this.getElement('update-btn').hide();
      }
      
    },
    
    $onUpdate: function(e) {
    
      e.stopPropagation();
      
      var goalsEl = this.getElement('goal-forms'), that = this;
      
      this.getElement('update-btn').hide();
            
      goalsEl.find('.goal-item').each(function() {
        
        var el = $(this);
                
        var goalId = $(this).attr('itemid');
        var value = $(this).find('input').val();
        
        el.addClass('updating').removeClass('error');
        
        that.model.updateGoal(goalId, value).then(function() {
          el.removeClass('updating');
        }, function() {
          el.removeClass('updating').addClass('error');
        });
        
      });
      
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
        'goal-chooser': { 'select': this.onSelect },
        'goal-editor': { 'back': this.onBack }
      };
    },
    
    // Public Methods
    
    setData: function(data) {
      this.getView('goal-chooser').setData(data);
    },
    
    // Event Listeners
    
    onBack: function(e) {
      e.stopPropagation();
      this.popView();
    },
    
    onSelect: function(e) {
      e.stopPropagation();
      this.getView('goal-editor').setData(e.data);
      this.pushView('goal-editor');
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
        'close-btn': { 'touchclick': this.$onClose },
        'list(.goal-item)': { 'click': this.$onSelect }
      };
    },
    
    // Public Methods
    
    setData: function(data) {
      
      this.data = data;
            
      var list = this.getElement('list');
      list.empty();
      
      var sortKey = '';
      
      _.each(_.sortBy(data, 'sortField'), function(item) {
                    
        if (item.sortField !== sortKey && item.category.name != 'Custom') {
          var displayKey = item.sortField.charAt(0).toUpperCase() + item.sortField.substr(1);
          list.append('<li class="goal-header">' + displayKey + '</li>');
          sortKey = item.sortField;
        }
        
        var el = $('<li class="goal-item" itemid="' + item.id + '"></li>');
        
        el.append('<div class="name">' + item.name + '</div>');
        
        list.append(el);
        
      });
      
    },
    
    clear: function() {
      this.getElement('list').empty();
    },
    
    // DOM Listeners
    
    $onSelect: function(e) {
      e.stopPropagation();
      var id = $(e.currentTarget).closest('[itemid]').attr('itemid');
      var data = _.find(this.data, function(item) {
        return item.id == id;
      });
      this.fire('select', data);
    },
    
    $onClose: function(e) {
      e.stopPropagation();
      this.fire('close');
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
      return ['back-btn', 'goal-name', 'goal-category', 'custom-field', 'unit-field', 'custom-unit-field', 'value-field', 'save-btn', 'goal-id-field'];
    },
    
    getBindings: function(e) {
      return {
        'back-btn': { 'touchclick': this.$onBack },
        'save-btn': { 'touchclick': this.$onSave }
      };
    },
    
    // Public Methods
    
    setData: function(goal) {
            
      this.getElement('goal-category').text(goal.category.name).attr('itemid', goal.category.id);
      var unitField = this.getElement('unit-field');
      
      this.getElement('goal-id-field').val(goal.id);
      this.getElement('value-field').val('');
            
      if (goal.category.name === 'Custom') {
      
        this.getElement('custom-field').val('').show();
        this.getElement('custom-unit-field').val('').show();
        this.getElement('unit-field').val('').hide();
        this.getElement('goal-name').val('').hide();
              
      } else {
            
        this.getElement('custom-field').val('').hide();
        this.getElement('custom-unit-field').val('').hide();
        this.getElement('unit-field').val('').show();
        this.getElement('goal-name').text(goal.name).show();
      
        unitField.empty();
        
        _.each(goal.validUnits || [], function(unit) {
          unitField.append('<option value="' + unit.id + '">' + unit.name + '</option>');
        });
        
      }
      
    },
    
    // DOM Listeners
    
    $onBack: function(e) {
      e.stopPropagation();
      this.fire('back');
    },
    
    $onSave: function(e) {
    
      e.stopPropagation();
      
      var that = this;
      
      var data = {
        goalId: this.getElement('goal-id-field').val(),
        categoryId: this.getElement('goal-category').attr('itemid'),
        unitId: this.getElement('unit-field').val(),
        targetValue: this.getElement('value-field').val(),
        customField: this.getElement('custom-field').val(),
        customUnitField: this.getElement('custom-unit-field').val()
      };
      
      if (this.getElement('goal-category').text() === 'Custom' && !data.customField) {
        return ErrorHandler.show('Please enter custom goal name');
      }
      
      if (!data.unitId && !data.customUnitField) {
        return ErrorHandler.show('Please enter unit');
      }
            
      if (!data.targetValue) {
        return ErrorHandler.show('Please enter target value');
      }
      
      this.fire('save', data);
      
    }
    
  });
  
  exports.WellnessController    = WellnessController;
  exports.LoginController       = LoginController;
  exports.GoalsController       = GoalsController;
  exports.GoalSetupController   = GoalSetupController;
  exports.GoalChooserController = GoalChooserController;
  exports.GoalEditorController  = GoalEditorController;

}, ['ui', 'wt.models']);