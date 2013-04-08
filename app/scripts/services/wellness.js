Clementine.add('wt.services', function(exports) {

  var Service = Clementine.Service;
  
  var Category = include('wt.objects').Category;
  var User = include('wt.objects').User;
  var Target = include('wt.objects').Target;
  var Unit = include('wt.objects').Unit;
  var UserGoal = include('wt.objects').UserGoal;
  var Goal = include('wt.objects').Goal;

  var WellnessService = Clementine.Service.extend({
  
    getType: function() {
      return 'wt';
    },
    
    getPrefix: function() {
      return '';
    },
    
    loginUser: function(email) {
            
      var deferred = jQuery.Deferred();
      
      deferred.resolve(new User({
        Id: 1,
        Email: 'kevin.kinnebrew@gmail.com'
      }));
      
      return deferred;
      
    },
    
    getCategories: function() {
    
      // returns [Categories]
      
      var deferred = jQuery.Deferred();
      
      deferred.resolve([new Category({
        Id: 1,
        Name: 'Fitness'
      }),
      new Category({
        Id: 2,
        Name: 'Nutrition'
      }),
      new Category({
        Id: 3,
        Name: 'Wellness'
      }),
      new Category({
        Id: 4,
        Name: 'Custom'
      })]);
      
      return deferred;
    
    },
    
    getUserGoals: function(userId) {
    
      // return [UserGoals] 4
      
      var deferred = jQuery.Deferred();
      
      //deferred.resolve([]);
      
      deferred.resolve([
        new UserGoal({
          Id: 1,
          SelectedGoal: { Id: 1, Name: 'Weight', Category: { Id: 1, Name: 'Fitness' }, Target: { Id: 1, Name: 'less' }, ValidUnits: [] },
          SelectedUnit: { Id: 1, Name: 'Pounds' },
          TargetValue: 20
        }),
        new UserGoal({
          Id: 2,
          SelectedGoal: { Id: 1, Name: 'Fiber', Category: { Id: 2, Name: 'Nutrition' }, Target: { Id: 2, Name: 'more' }, ValidUnits: [] },
          SelectedUnit: { Id: 1, Name: 'Grams' },
          TargetValue: 50
        })
      ]);
      
      return deferred;
    
    },
    
    getGoalsForCategory: function(categoryId) {
    
      // return [Goals]
      
      var deferred = jQuery.Deferred();
      
      if (categoryId == 3) {
        
        deferred.resolve([
          new Goal({ Id: 1, Name: 'Running', Category: { Id: 3, Name: 'Wellness' }, Target: { Id: 1, Name: 'less' }, ValidUnits: [{ Id: 1, Name: 'Day' },  { Id: 2, Name: 'Pounds' }] }),
          new Goal({ Id: 2, Name: 'Walking', Category: { Id: 3, Name: 'Wellness' }, Target: { Id: 2, Name: 'more' }, ValidUnits: [{ Id: 1, Name: 'Day' },  { Id: 2, Name: 'Pounds' }] }),
          new Goal({ Id: 3, Name: 'Jumping', Category: { Id: 3, Name: 'Wellness' }, Target: { Id: 2, Name: 'more' }, ValidUnits: [{ Id: 1, Name: 'Day' },  { Id: 2, Name: 'Pounds' }] }),
          new Goal({ Id: 4, Name: 'Eating', Category: { Id: 3, Name: 'Wellness' }, Target: { Id: 2, Name: 'less' }, ValidUnits: [{ Id: 1, Name: 'Day' },  { Id: 2, Name: 'Pounds' }] }),
          new Goal({ Id: 5, Name: 'Sleeping', Category: { Id: 3, Name: 'Wellness' }, Target: { Id: 2, Name: 'more' }, ValidUnits: [{ Id: 1, Name: 'Day' },  { Id: 2, Name: 'Pounds' }] })
        ]);
        
      } else {
      
        deferred.resolve([
          new Goal({ Id: 1, Name: 'Less', Category: { Id: 4, Name: 'Custom' }, Target: { Id: 1, Name: 'less' }, ValidUnits: [] }),
          new Goal({ Id: 2, Name: 'More', Category: { Id: 4, Name: 'Custom' }, Target: { Id: 2, Name: 'more' }, ValidUnits: [] }),
          new Goal({ Id: 3, Name: 'Target', Category: { Id: 4, Name: 'Custom' }, Target: { Id: 2, Name: 'more' }, ValidUnits: [] })
        ]);
      
      }
      
      return deferred;
    
    },
    
    saveGoal: function(userId, categoryId, goalId, unitId, targetValue) {
      
      var data = {
        UserId: userId,
        CategoryId: categoryId,
        GoalId: goalId,
        UnitId: unitId,
        TargetValue: targetValue
      };
            
      // return UserGoal
      
      var deferred = jQuery.Deferred();
      
      deferred.resolve(new UserGoal({
        Id: 1,
        SelectedGoal: { Id: 1, Name: 'Weight', Category: { Id: 3, Name: 'Fitness' }, Target: { Id: 1, Name: 'less' }, ValidUnits: [] },
        SelectedUnit: { Id: 1, Name: 'Pounds' },
        TargetValue: 12
      }));
      
      return deferred;
    
    },
    
    saveCustomGoal: function(userId, categoryId, goalId, targetValue, customName, customUnit) {
      
      var data = {
        UserId: userId,
        CategoryId: categoryId,
        GoalId: goalId,
        TargetValue: targetValue,
        CustomName: customName,
        CustomUnit: customUnit
      };
            
      // return UserGoal
      
      var deferred = jQuery.Deferred();
      
      deferred.resolve(new UserGoal({
        Id: 1,
        SelectedGoal: { Id: 1, Name: 'Weight', Category: { Id: 4, Name: 'Custom' }, Target: { Id: 1, Name: 'less' }, ValidUnits: [] },
        SelectedUnit: { Id: 1, Name: 'My Custom Unit' },
        TargetValue: 45,
        CustomName: 'My Custom Goal'
      }));
      
      return deferred;
      
    },
    
    setGoalProgress: function(userId, goalId, currentValue) {
      
      var data = {
        UserId: userId,
        GoalId: goalId,
        CurrentValue: currentValue
      };
      
      var deferred = jQuery.Deferred();
      
      setTimeout(function() {
        deferred.resolve();
      }, 1000);
      
      return deferred;
      
      // return UserGoal
      
    }
  
  });

  exports.WellnessService = WellnessService;

}, ['wt.objects']);