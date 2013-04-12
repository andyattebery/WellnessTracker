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
      
      return this.deferRequest('/User?email=' + encodeURI(email), 'POST', {}, function(data) {
        return new User(data);
      });
      
    },
    
    getCategories: function() {
      return this.deferRequest('/Category', 'GET', {}, function(data) {
        return _.map(data, function(category) {
          return new Category(category);
        });
      });
    },
    
    getUserGoals: function(userId) {
    
      var params = {
        userId: userId
      };
      
      return this.deferRequest('/UserGoal', 'GET', params, function(data) {
        return _.map(data, function(userGoal) {
          return new UserGoal(userGoal);
        });
      });
        
    },
    
    getGoalsForCategory: function(categoryId) {
      
      var params = {
        categoryId: categoryId
      };
      
      return this.deferRequest('/Goal', 'GET', params, function(data) {
        return _.map(data, function(goal) {
          return new Goal(goal);
        });
      });
    
    },
    
    saveGoal: function(userId, goalId, unitId, targetValue) {
      
      var params = {
        UserId: userId,
        GoalId: goalId,
        UnitId: unitId,
        TargetValue: targetValue
      };
      
      return this.deferRequest('/UserGoal', 'POST', params, function(data) {
        return new UserGoal(data);
      });
    
    },
    
    saveCustomGoal: function(userId, goalId, targetValue, customName, customUnit) {
      
      var params = {
        UserId: userId,
        GoalId: goalId,
        TargetValue: targetValue,
        CustomGoal: customName,
        CustomUnit: customUnit
      };
      
      return this.deferRequest('/UserGoal', 'POST', params, function(data) {
        return new UserGoal(data);
      });
      
    },
    
    setGoalProgress: function(userId, goalId, currentValue) {
      
      var params = {
        UserId: userId,
        GoalId: goalId,
        CurrentValue: currentValue
      };
      
      return this.deferRequest('/TrackingEntry', 'POST', params, null);
            
    }
  
  });

  exports.WellnessService = WellnessService;

}, ['wt.objects']);