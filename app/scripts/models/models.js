Clementine.add('wt.models', function(exports) {

  var WellnessViewModel = Class.extend({
  
    initialize: function(service) {
    
      this.service = service;
    
    },
    
    load: function() {
    
      // if has local storage item
      
      // get user goals
      
      // success -> push view
      
      // fail -> login screen
    
    }
  
  });
  
  var LoginViewModel = Class.extend({
  
    initialize: function(service) {
    
      this.service = service;
    
    },
    
    login: function(email) {
    
      // login user
      
      // return User object
      
    }
  
  });
  
  var GoalsViewModel = Class.extend({
  
    initialize: function(service) {
    
      this.service = service;
    
    },
    
    load: function(goals) {
    
      // validate goals
      
      // fetch goals for unset categories
    
    },
    
    getGoalsForCategory: function(categoryId) {
    
      // wait for load
      
      // return goals list
    
    },
    
    setUserGoal: function(goalId) {
    
      // login user
      
      // return User object
      
    },
    
    updateGoals: function(goals) {
      
      // run update of all four goal categories
      
    }
  
  });

  exports.WellnessViewModel = WellnessViewModel;
  exports.LoginViewModel    = LoginViewModel;
  exports.GoalsViewModel    = GoalsViewModel;

}, []);