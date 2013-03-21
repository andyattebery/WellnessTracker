/**
services.js | 3.6.2012 | v1.0
WMP Wellness Tracker
Copyright 2013 West Monroe Partners, LLC
*/

Clementine.add('wt-services', function(exports) {

  // @region Declarations
  
  var GoalsService;
  
  // @region Dependencies
  
  var Service = Clementine.Service;
  
  var Goal = include('wt-models').Goal;
  var Unit = include('wt-models').Unit;
  var UserGoal = include('wt-models').UserGoal;
  var CustomUserGoal = include('wt-models').CustomUserGoal;
  
  
  // @region Service Definitions
  
  /**
  @class GoalsService
  */
  GoalsService = Service.extend({
  
  // @region Configuration
  
  getType: function() {
    return 'goals';
  },
  
  getPrefix: function() {
    return '';
  },
  
  // @region Endpoints
  
  getGoals: function(success, failure, context) {

    var map = function(data) {
      if (data === 'null' || data === null) {
        throw 'Invalid data';
      }
      var goals = [];
      for (var i = 0; i < data.length; i++) {
        goals.push(new Goal(data[i]));
      }
      return goals;
    };
        
    return this.request('../MockData/goal_values.json', 'GET', {}, map, success, failure, context);
    
  },
  
  getUnits: function(success, failure, context) {
    
    var map = function(data) {
      if (data === 'null' || data === null) {
        throw 'Invalid data';
      }
      var units = [];
      for (var i = 0; i < data.length; i++) {
        units.push(new Unit(data[i]));
      }
      return units;
    };
    
    return this.request('../MockData/units.json', 'GET', {}, map, success, failure, context);
    
  },
  
  getUserGoals: function(email, success, failure, context) {
  
    var params = {
      email: email        
    };
    
    var map = function(data) {
      if (data === 'null' || data === null) {
        throw 'Invalid data';
      }
      var userGoals = [];
      for (var i = 0; i < data.length; i++) {
        userGoals.push(new UserGoal(data[i]));
      }
      return userGoals;
    };
    
    return this.request('http://wmpwellnesstracker.azurewebsites.net/api/UserGoal', 'GET', params, map, success, failure, context);
    
  },
  
  getCustomUserGoal: function(email, success, failure, context) {
  
    var params = {
      email: email
    };
    
    var map = function(data) {
      if (data === 'null' || data === null) {
        throw 'Invalid data';
      }       
      return new CustomUserGoal(data);             
    };
    
    return this.request('http://wmpwellnesstracker.azurewebsites.net/api/CustomUserGoal', 'GET', params, map, success, failure, context);
  
  },
  
  setUserGoal: function(setData, success, failure, context) {
  
    var params = {
      UserEmail: setData.username,
      Id: 1,
      CategoryId: setData.categoryId,
      ItemId: setData.itemId,
      UnitId: setData.unitId,
      Value: setData.value
    };
    
    return this.request('http://wmpwellnesstracker.azurewebsites.net/api/UserGoal', 'POST', params, null, success, failure, context);
  
  },
  
  setCustomUserGoal: function(setData, success, failure, context){
  
    var params = {
      Id: null,
      UserEmail: setData.username,
      Name: setData.name,
      Unit: setData.unit,
      Value: setData.value
    };
    
    return this.request('http://wmpwellnesstracker.azurewebsites.net/api/CustomUserGoal', 'POST', params, null, success, failure, context);
  
  },
  
  updateUserGoal: function(setData, success, failure, context) {
  
    var params = {
      id: setData.id,
      value: setData.value
    };
    
    return this.request('', 'POST', params, null, success, failure, context);
  
  },
  
  updateCustomUserGoal: function(setData, success, failure, context) {
  
    var params = {
      id: setData.id,
      value: setData.value
    };
    
    return this.request('', 'POST', params, null, success, failure, context);
  
  }
  
  
  });
  
  // @region Exports
  
  exports.GoalsService = GoalsService;  

}, ['wt-models']);
