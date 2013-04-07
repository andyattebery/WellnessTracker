Clementine.add('wt.services', function(exports) {

  var Service = Clementine.Service;

  var WellnessService = Clementine.Service.extend({
  
    getType: function() {
      return 'wt';
    },
    
    getPrefix: function() {
      return '';
    },
    
    loginUser: function(email) {
      
      // return User
      
    },
    
    getCategories: function() {
    
      // returns [Categories]
    
    },
    
    getUserGoals: function(userId) {
    
      // return [UserGoals] 4
    
    },
    
    getGoalsForCategory: function(categoryId) {
    
      // return [Goals]
    
    },
    
    saveGoal: function(userId, goalId, unitId, targetValue) {
      
      var data = {
        UserId: userId,
        GoalId: goalId,
        UnitId: unitId,
        TargetValue: targetValue,
        CustomUnit: CustomUnit
      };
      
      // return UserGoal
    
    },
    
    saveCustomGoal: function(userId, goalId, targetValue, customName, customUnit) {
      
      var data = {
        UserId: userId,
        GoalId: goalId,
        TargetValue: targetValue,
        CustomName: customName,
        CustomUnit: customUnit
      };
      
      // return UserGoal
      
    },
    
    setGoalProgress: function(userId, goalId, currentValue) {
      
      var data = {
        UserId: userId,
        GoalId: goalId,
        CurrentValue: currentValue
      };
      
      // return UserGoal
      
    }
  
  });

  exports.WellnessService = WellnessService;

}, []);