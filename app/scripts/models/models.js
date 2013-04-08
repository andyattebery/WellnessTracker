Clementine.add('wt.models', function(exports) {

  var LoginViewModel = Class.extend({
  
    initialize: function(service) {
    
      this.service = service;
    
    },
    
    loginUser: function(email) {
          
      return this.service.loginUser(email).done(function(user) {
        localStorage.setItem('wellness_uid', user.id);
      });
      
    }
  
  });
  
  var GoalsViewModel = Class.extend({
  
    initialize: function(service) {
    
      this.service = service;
      
      this.categoryRequest = this.service.getCategories();
    
    },
    
    getUserGoals: function(userId) {
            
      this.userId = userId;
      
      return this.service.getUserGoals(userId);
      
    },
    
    getCategories: function() {
      
      return this.service.getCategories();
      
    },
    
    getGoalsForCategory: function(categoryId) {
          
      return this.service.getGoalsForCategory(categoryId);
          
    },
    
    saveGoal: function(categoryId, goalId, unitId, targetValue) {
      
      return this.service.saveGoal(this.userId, categoryId, goalId, unitId, targetValue);
    
    },
    
    saveCustomGoal: function(categoryId, goalId, targetValue, customName, customUnit) {
      
      return this.service.saveCustomGoal(this.userId, categoryId, goalId, targetValue, customName, customUnit);
      
    },
    
    updateGoal: function(goalId, currentValue) {
      
      return this.service.setGoalProgress(this.userId, goalId, currentValue);
      
    }
  
  });

  exports.LoginViewModel    = LoginViewModel;
  exports.GoalsViewModel    = GoalsViewModel;

}, []);