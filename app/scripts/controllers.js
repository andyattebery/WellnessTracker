Clementine.add('wt.controllers', function(exports) {

  var ViewController        = Clementine.ViewController;
  
  var NavigationController  = include('ui').NavigationController;
  var ModalViewController   = include('ui').ModalViewController;
  
  var WellnessController = NavigationController.extend({
    
    // Configuration
    
    getType: function() {
      return 'wellness';
    },
    
    getBindings: function() {
      return {
        'login': { 'login': this.onLogin, 'progress': this.onProgress },
        'goals': { 'logout': this.onLogout, 'progress': this.onProgress }
      };
    },
    
    // Public Methods
    
    setup: function() {
      this.retainCount = 0;
      this.progress = $('body > .progress');
      this.indicator = this.setupLoading();
    },
    
    setupLoading: function() {
  
      var opts = {
        lines: 9, // The number of lines to draw
        length: 6, // The length of each line
        width: 4, // The line thickness
        radius: 7, // The radius of the inner circle
        color: '#FFF', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false // Whether to render a shadow
      };
        
      return new Spinner(opts).spin(this.progress.get(0));
  
    },
  
    showLoading: function() {
      if (this.retainCount === 0) {
        clearTimeout(this.hideTimeout);
        this.progress.removeClass('hidden');
        this.showTimeout = setTimeout(proxy(function() {
          this.progress.addClass('active');
        }, this), 50);
        this.indicator.spin(this.progress.get(0));
      }
      this.retainCount++;
    },
  
    hideLoading: function() {
      if (this.retainCount === 0) {
        return;
      }
      this.retainCount--;
      if (this.retainCount === 0) {
        clearTimeout(this.showTimeout);
        this.progress.removeClass('active');
        this.hideTimeout = setTimeout(proxy(function() {
          this.progress.addClass('hidden');
          this.indicator.stop();
        }, this), 500);
      }
    },
    
    // State Handlers
    
    onWillLoad: function() {
      ErrorHandler.init();      
      this._super();
    },
    
    // Event Listeners
    
    onLogin: function(e) {      
      e.stopPropagation();
      var that = this;
      this.getView('goals').setUserId(e.data).done(function() {
        that.pushView('goals');
      });
    },
    
    onLogout: function(e) {
      e.stopPropagation();
      this.getView('login').logout();
      this.popToRootView();    
    },
    
    onProgress: function(e) {
      return e.data ? this.showLoading() : this.hideLoading();
    }
    
  });
  
  var LoginController = ViewController.extend({
  
    initialize: function(parent, target, app) {

      this.service = app.getService('wt');
    
      this._super(parent, target, app);
    
    },
  
    // Configuration
  
    getType: function() {
      return 'login';
    },
    
    getBindings: function() {
      return {
        'email-field': { 'keypress': this.$onKeyPress },
        'login-btn': { 'touchclick': this.$onLogin }
      };
    },
    
    // Public Methods
    
    logout: function() {
      this.getElement('email-field').val('');
      localStorage.removeItem('wellness_uid');
    },
    
    // State Handlers
    
    onDidAppear: function() {
      
      var userId = localStorage.getItem('wellness_uid');
    
      if (userId) {
        this.fire('progress', true);
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
      
      if (e) {
        e.stopPropagation();
      }
      
      var email = this.getElement('email-field').val(), that = this;
            
      if (!email) {
        return ErrorHandler.show('Please enter an email');
      }
      
      this.fire('progress', true);
    
      this.service.loginUser(email).then(function(user) {
        localStorage.setItem('wellness_uid', user.id);
        that.fire('login', user.id);        
      }, function() {
        ErrorHandler.show('Could not login');
      });
    
    }
  
  });
  
  var GoalsController = ViewController.extend({
    
    initialize: function(parent, target, app) {
    
      this.service = app.getService('wt');
      this.userId = null;
      
      this._super(parent, target, app);
    
    },
    
    getType: function() {
      return 'goals';
    },
    
    getBindings: function() {
      return {
        'modal-view': { 'close': this.onClose, 'save': this.onSave },
        'goal-forms(.set)': { 'touchclick': this.$onSet },
        'goal-forms(.value-field)': { 'blur': this.$onBlur },
        'update-btn': { 'click': this.$onUpdate } ,
        'back-btn': { 'click': this.$onBack }
      };
    },
    
    setup: function() {
      this.addView(ModalViewController, 'modal-view', 'modal-view', 'goal-setup.html', 'body');
    },
    
    // State Handlers
    
    onWillLoad: function() {
      
      var startDate = new Date();
      
      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
            
      while (startDate.getDay() !== 0) {
        startDate = new Date(startDate.setDate(startDate.getDate() - 1));
      }
      
      this.getElement('period').text(months[startDate.getMonth()] + ' ' + startDate.getDate() + ', ' + startDate.getFullYear());
      
      this.getElement('update-btn').hide();
      this.getElement('update-msg').show();
      
      this._super();
    
    },
    
    // Public Methods
    
    setUserId: function(userId) {
    
      this.userId = userId;
      
      var that = this, deferred = jQuery.Deferred();
                
      this.service.getCategories().then(function(categories) {
        that.renderCategories(categories).done(function() {
          deferred.resolve();
          that.fire('progress', false);
        });
      }, function() {
        ErrorHandler.show('Could not load categories');
      });
      
      return deferred;
      
    },
    
    requestGoals: function(e) {
      
      var that = this;
            
      if (!this.userId) {
        console.log('No user specified');
        return;
      }
      
      return this.service.getUserGoals(this.userId).then(function(goals) {
        that.renderGoals(goals);
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
        var container = $('<div class="goal-label"></div>');
        container.append('<span class="goal-unit"></span> ');
        container.append('<span class="goal-name"></span> ');
        container.append('<span class="goal-value hidden"></span>');
        el.append(container);
        el.append('<input type="number" class="value-field" name="value" />');
        el.append('<input type="button" class="set-goal-btn btn set" value="Set Goal" />');
        
        goals.append(el);
        
      });
            
      return this.requestGoals();
      
    },
    
    renderGoals: function(goals) {
          
      var goalsEl = this.getElement('goal-forms'), that = this;
            
      this.goalsCount = 0;
      var updated = false;
      
      _.each(goals, function(goal) {
        
        that.goalsCount++;
                
        var el = goalsEl.find('.goal-item[itemid="' + goal.selectedGoal.category.id + '"]');
                
        el.removeClass('unset');
        el.find('.goal-name').text(goal.selectedGoal.displayText).attr('itemid', goal.selectedGoal.id);
        el.find('.value-field').attr('placeholder', goal.targetValue);
        el.find('.goal-unit').text(goal.selectedUnit.name);
        
        if (goal.latestEntryValue) {
          el.find('.value-field').attr('disabled', 'disabled');
          updated = true;  
        } else {
          el.find('.value-field').removeAttr('disabled');
        }
      
      });
      
      if (updated) {
        this.getElement('update-msg').text('Goals already updated this week.');
      } else if (this.goalsCount === 4) {
        this.getElement('update-msg').text('Update goals for this week.');
      } else {
        this.getElement('update-msg').text('Please set all your goals.');
      }
    
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
        el.find('.goal-name').text(userGoal.selectedGoal.displayName).attr('itemid', userGoal.selectedGoal.id);
        el.find('.value-field').attr('placeholder', goal.targetValue);
        el.find('.goal-unit').text(userGoal.selectedUnit.name);
        el.find('[type="button"]').hide();
      
        that.getView('modal-view').dismissModalView();
        
        that.goalsCount++;
                
        if (that.goalsCount === 4) {
          that.getElement('update-msg').text('Update Goals');
        } else {
          that.getElement('update-msg').text('Set Goals');
        }
        
      }
      
      function failure() {
        ErrorHandler.show('Could not set goal');
        that.getView('modal-view').dismissModalView();
      }
            
      if (goal.customField.length > 0) {
        this.service.saveCustomGoal(this.userId, goal.goalId, goal.targetValue, goal.customField, goal.customUnitField).then(success, failure);
      } else {
        this.service.saveGoal(this.userId, goal.goalId, goal.unitId, goal.targetValue).then(success, failure);
      }
      
    },
    
    // DOM Listeners
    
    $onSet: function(e) {
    
      e.stopPropagation();
      
      var categoryId = $(e.currentTarget).closest('.goal-item').attr('itemid'), that = this;
            
      this.service.getGoalsForCategory(categoryId).then(function(data) {
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
        this.getElement('update-btn').fadeIn();
        this.getElement('update-msg').fadeOut();
      } else {
        this.getElement('update-btn').hide();
        this.getElement('update-msg').show();
      }
      
    },
    
    $onUpdate: function(e) {
    
      e.stopPropagation();
      
      var goalsEl = this.getElement('goal-forms'), that = this;
      
      this.getElement('update-btn').fadeOut();
      this.getElement('update-msg').fadeIn().text('Goals Updated');
            
      goalsEl.find('.goal-item').each(function() {
        
        var el = $(this);
                
        var goalId = $(this).attr('itemid');
        var value = $(this).find('input').val();
        
        el.addClass('updating').removeClass('error');
        
        that.service.setGoalProgress(that.userId, goalId, value).then(function() {
          el.removeClass('updating');
          el.find('input[type="number"]').attr('disabled', 'disabled');
        }, function() {
          el.removeClass('updating').addClass('error');
        });
        
      });
      
    },
    
    $onBack: function(e) {
      e.stopPropagation();
      this.fire('logout');
    }
    
  });
  
  var GoalSetupController = NavigationController.extend({
    
    getType: function() {
      return 'goal-setup';
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
  
  var GoalChooserController = ViewController.extend({
    
    getType: function() {
      return 'goal-chooser';
    },
    
    getBindings: function() {
      return {
        'close-btn': { 'click': this.$onClose },
        'list(.goal-list-item)': { 'click': this.$onSelect }
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
        
        var el = $('<li class="goal-list-item" itemid="' + item.id + '"></li>');
        
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
  
  var GoalEditorController = ViewController.extend({
    
    getType: function() {
      return 'goal-editor';
    },
    
    getBindings: function(e) {
      return {
        'back-btn': { 'touchclick': this.$onBack },
        'save-btn': { 'touchclick': this.$onSave }
      };
    },
    
    // Public Methods
    
    setData: function(goal) {
      
      this.getElement('goal-id-field').val(goal.id);
      this.getElement('goal-category').text(goal.category.name).attr('itemid', goal.category.id);
      var unitField = this.getElement('unit-field').val('');
      
      this.getElement('value-field').val('');
      this.getElement('custom-field').val('');
      this.getElement('custom-unit-field').val('');
      this.getElement('goal-name').text('');
      
      if (goal.category.name === 'Custom') {

        this.target.addClass('custom');        
        this.getElement('goal-name').text('');
              
      } else {
      
        this.target.removeClass('custom');
        this.getElement('goal-name').text(goal.name + ' Goal');
      
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

}, ['ui']);