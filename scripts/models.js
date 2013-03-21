/**
 models.js | 3.6.2013 | v1.0
 WMP Wellness Tracker
 Copyright 2013 West Monroe Partners, LLC
 */

Clementine.add('wt-models', function(exports) {

  // @region Declarations

  var Goal;
  var UserGoal;
  var CustomUserGoal;
  var Unit;


  // @region Helpers

  function cleanSpecialChars(data, title) {

    if (typeof data === 'string') {
      data = data.replace(/&#39;/g, "'");
      data = data.replace(/&#34;/g, '"');
    }

    if (typeof data === 'string' && title) {
      data = titleCaps(data.toLowerCase());
    }

    // abbreviations
    var abbr = ['oz', 'aj', 'abc', 'bbq', 'tff', 'ref', 'ez', 'ct', 'ss', 'iw', 'lb', 'pk', 'qty', 'b1', 'b2', 'b12', 'b6', 'us'];

    if (!data) {
      return '';
    }

    // clean abbreviations
    for (var i = 0; i < abbr.length; i++) {
      data = data.replace(new RegExp("\\b" + abbr[i] + "\\b", 'gi'), abbr[i].toUpperCase());
    }

    return data || '';
  }

  var ModelHelpers = {

    checkForUndefined: function(dict, data) {
      var output = {};
      for (var field in dict) {
        output[field] = typeof data[field] !== 'undefined' ? data[field] : dict[field];
      }
      return output;
    },

    transformModelFromService: function(model) {
      
    }
    
  };

  /**
    @class Goal
  */
  Goal = (function() {

    function Goal(data) {
      this.id = data.id;
      this.tileName = data.name;
      this.activities = data.items;
    }

    return Goal;

  }());

  /**
    @class Unit
  */
  Unit = (function() {

    function Unit(data) {
      this.id = data.id;
      this.unitName = data.name;
      
    }

    return Unit;

  }());

    /**
    @class UserGoal
  */
  UserGoal = (function() {

    function UserGoal(data) {
      this.category = data.category;
      this.item = data.item;
      this.unit = data.unit;
      this.value = data.value;      
    }

    return UserGoal;

  }());

    /**
    @class CustomUserGoal
  */
  CustomUserGoal = (function() {

    function CustomUserGoal(data) {
      this.name = data.name;
      this.unit = data.unit;
      this.value = data.value;
      
    }

    return CustomUserGoal;

  }());
  

  // @region Exports

  exports.Goal = Goal;
  exports.UserGoal = UserGoal;
  exports.CustomUserGoal = CustomUserGoal;
  exports.Unit = Unit;
  

}, []);
