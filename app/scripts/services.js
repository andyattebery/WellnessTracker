Clementine.add('wt.services', function(exports) {

  var Service = Clementine.Service;
  
  var Category  = include('wt.objects').Category;
  var User      = include('wt.objects').User;
  var Target    = include('wt.objects').Target;
  var Unit      = include('wt.objects').Unit;
  var UserGoal  = include('wt.objects').UserGoal;
  var Goal      = include('wt.objects').Goal;

  var WellnessService = Clementine.Service.extend({
  
    getType: function() {
      return 'wt';
    },
    
    getPrefix: function() {
      return '/api';
    },
    
    loginUser: function(email) {
      
      return this.deferRequest('/User?email=' + encodeURI(email), 'POST', {}, null);
      
    },
    
    getCategories: function() {
      return this.deferRequest('/Category', 'GET', {}, null);
    },
    
    getUserGoals: function(userId) {
    
      var params = {
        userId: userId
      };
      
      return this.deferRequest('/UserGoal', 'GET', params, null);
        
    },
    
    getGoalsForCategory: function(categoryId) {
      
      var params = {
        categoryId: categoryId
      };
      
      return this.deferRequest('/Goal', 'GET', params, null);
    
    },
    
    saveGoal: function(userId, goalId, unitId, targetValue) {
      
      var data = {
        UserId: userId,
        GoalId: goalId,
        UnitId: unitId,
        TargetValue: targetValue
      };
      
      return this.deferRequest('/UserGoal', 'POST', params, null);
    
    },
    
    saveCustomGoal: function(userId, goalId, targetValue, customName, customUnit) {
      
      var data = {
        UserId: userId,
        GoalId: goalId,
        TargetValue: targetValue,
        CustomName: customName,
        CustomUnit: customUnit
      };
      
      return this.deferRequest('/UserGoal', 'POST', params, null);
      
    },
    
    setGoalProgress: function(userId, goalId, currentValue) {
      
      var data = {
        UserId: userId,
        GoalId: goalId,
        CurrentValue: currentValue
      };
      
      return this.deferRequest('/TrackingEntry', 'POST', params, null);
            
    }
  
  });

  exports.WellnessService = WellnessService;

}, ['wt.objects']);