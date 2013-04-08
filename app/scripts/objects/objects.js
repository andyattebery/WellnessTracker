Clementine.add('wt.objects', function(exports) {
  
  /**
   * The active user's object.
   */
  function User(data) {
  
    if (!data) {
      throw 'Invalid data for User';
    }
  
    this.id = data.Id;
    this.email = data.Email;
    
  }
  
  /**
   * ex. Fitness/Rest & Wellness/Custom/Nutrition
   */
  function Category(data) {
  
    if (!data) {
      throw 'Invalid data for Category';
    }
  
    this.id    = data.Id;
    this.name  = data.Name;
    
  }
  
  /**
   * ex. less/more/equal
   */
  function Target(data) {
    
    if (!data) {
      throw 'Invalid data for Target';
    }
  
    this.id = data.Id;
    this.name = data.Name;
    
  }
  
  /**
   * ex. miles/pounds/days
   */
  function Unit(data) {
  
    if (!data) {
      throw 'Invalid data for Unit';
    }
  
    this.id = data.Id;
    this.name = data.Name;
    
  }
  
  /**
   * The available goals in a given category.
   */
  function Goal(data) {
  
    if (!data) {
      throw 'Invalid data for Goal';
    }
  
    this.id = data.Id;
    this.name = data.Name;
    this.category = new Category(data.Category);
    this.target = new Target(data.Target);
    this.sortField = this.target.name;
    this.validUnits = _.map(data.ValidUnits, function(validUnit) {
      return new Unit(validUnit);
    });
    
  }
  
  /**
   * The goal chosen per category for a given user.
   */
  function UserGoal(data) {
  
    if (!data) {
      throw 'Invalid data for User';
    }
  
    this.id = data.Id;
    this.selectedGoal = new Goal(data.SelectedGoal);
    this.selectedUnit = new Unit(data.SelectedUnit);
    this.targetValue = data.TargetValue;
    this.customName = data.CustomName;
    
  }
  
  /**
   * An entry tracking the user's progress towards a goal.
   */
  function TrackingEntry(data) {
    
    if (!data) {
      throw 'Invalid data for TrackingEntry';
    }
    
    this.id = data.Id;
    this.value = data.Value;
    this.date = data.Date;
    this.goal = new UserGoal(data.Goal);
    
  }
  
  exports.User = User;
  exports.Category = Category;
  exports.Target = Target;
  exports.Unit = Unit;
  exports.Goal = Goal;
  exports.UserGoal = UserGoal;
  exports.TrackingEntry = TrackingEntry;

});