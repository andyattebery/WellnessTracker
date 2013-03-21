/**
 controllers.js | 3.5.2013 | v1.0
 WMP Wellness Tracker
 Copyright 2013 West Monroe Partners, LLC
*/

Clementine.add('wt-controllers', function(exports) {

  // @region Declarations

  var WTController;
  var LoginController;
  var FocusManagerController;
  var FocusController;
  var GoalsModalController;
  var GoalController;
  var HomeGoalsController;
  var SimpleListController;


  // @region Dependencies

  var View = Clementine.View;
  var ViewController = Clementine.ViewController;
  var NavigationController = include('ui').NavigationController;
  var ModalViewController = include('ui').ModalViewController;

  // @region Controller Definitions

  /**
  @class WTController
  @extends NavigationController
  */
  WTController = NavigationController.extend({

    // @region Configuration

    getType: function() {
      return 'wt';
    },

    getBindings: function() {
      return {
        'login': { 'progress': this.onProgress },
        'focus': { 'activitySelected': this.onActivitySelected, 'set-title': this.setTitle },
        'home-goals': { 'show-back': this.onShowBackButton, 'set-title': this.setTitle },
        'goal': { 'set-title': this.setTitle },
        'back-btn': { 'touchclick': this.$onBack }                         
      };
    },

    getDefaultRoute: function() {
      return 'login';
    },
    
    getRoutes: function () {
      
      function onLogin(current, routes) {
        if (current === 'home-goals') {
          this.popView();
        } else if (current === 'login') {
          this.getView('login').setRoute(routes);        
        }
      }
      
      function onHomeGoals(current, routes) {
        if (current === 'focus') {
          this.getView('home-goals').refresh();
          this.getView('home-goals').getView('focus-modal').dismissModalView();
        } else if (current === 'home-goals') {
          this.getView('home-goals').setRoute(routes);          
        } else if (current === 'login') {
          this.getView('home-goals').refresh();
          this.pushView('home-goals');
        }
      }
      
      function onFocus(current, routes) {
        var a = 1;
      }

      return {
        'login': onLogin,
        'home-goals': onHomeGoals,
        'focus': onFocus
      };
    },
    

    setup: function() {
      this.retainCount = 0;
      this.progress = $('body > .progress');
      this.indicator = this.setupLoading();
    },


    // @region Public Methods

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


    // @region State Handlers

    onWillLoad: function() {

      if ((/android/gi).test(navigator.appVersion)) {
        $("body").addClass('touch').addClass('android');
      } else if ((/iphone|ipad/gi).test(navigator.appVersion)) {
        $("body").addClass('touch').addClass('ios');
      } else {
        $("body").addClass('desktop');
      }

      ErrorHandler.init();

      this._super();

    },

    onWillAppear: function() {
      $('body').removeClass('hidden');
      this._super();
    },

    // @region Event Handlers

    onProgress: function(e) {
      if (e.data) {
        this.showLoading();
      } else {
        this.hideLoading();
      }
    },

    onShowBackButton: function(e) {
      this.find('.back-btn').show();
    },

    $onBack: function() {
      var hash = location.hash;

      var map = {
        '#home-goals$': '#login',
        '#home-goals/focus$': '#home-goals',
        '#home-goals/focus/goal': '#home-goals/focus',
        '#home-goals/focus/custom-goal': '#home-goals'
        
      };

      for (var pattern in map) {
        if (hash.match(new RegExp(pattern))) {
          location.hash = map[pattern];
          return;
        }
      }
    },

    setTitle: function(e) {
      this.getElement('title').text(e.data);
    }

  });


  /**
  @class LoginController
  @extends ViewController
  @bubbles progress
  @fires login
  */
  LoginController = ViewController.extend({

    // @region Configuration

    getType: function() {
      return 'login';
    },

    getOutlets: function() {
      return {
        elements: ['email-field', 'login-btn']
      };
    },

    getBindings: function() {
      return {
        'email-field': { 'keypress': this.$onKeyPress },
        'submit-btn': { 'touchclick': this.$onLogin }
      };
    },

    // @region Public Methods

    clearForm: function() {
      this.getElement('username-field').val('');      
    },    

    isAndroidPhone: function() {
      return $(window).height() < 700 && (/android/gi).test(navigator.appVersion);
    },


    // @region DOM Listeners

    $onKeyPress: function(e) {
      var code = (e.keyCode ? e.keyCode : e.which);
      if (code === 13) {
        this.getElement('email-field').blur();
        this.$onLogin();
      }
    },

    $onLogin: function(e) {

      //this.find('#login-form').checkValidity();
      var username = this.getElement('email-field').val();      

      if (username.length === 0) {
        ErrorHandler.show('Please enter a valid email address.');
        return;
      }

      if (!this.find('.email-field')[0].checkValidity()) {
        ErrorHandler.show('Please enter a valid email address.');
        return;
      }
      StorageManager.SetObject(Constants.Username, username);
      location.hash = '#home-goals';
    }

  });

  /**
  @class FocusManagerController
  @extends NavigationController
  @bubbles pro
  */

  FocusManagerController = NavigationController.extend({
  
    getType: function() {
      return 'focus-manager';
    },

    getDefaultRoute: function() {
      return 'focus';
    },

    getRoutes: function() {
      
      function onGoal(current, routes) {
        this.pushView('goal');
        
      }

      function onCustomGoal(current, routes) {
        this.pushView('goal');
      }

      function onFocus(current, routes) {
        if (current === 'focus') {
          this.pushView('goal');          
        }
        else if (current === 'goal') {
          this.popView();
        }
      }

      return {
        'goal': onGoal,
        'focus': onFocus,
        'custom-goal': onCustomGoal
      }
    },

    getBindings: function() {
      return {
        'focus': { 'activity-select': this.onActivitySelect },
        'goal': { 'submit-goal': this.onSubmitGoal }
      }
    },

    setData: function(data, elOrigin, elOriginId, units) {
      this.getView('focus').setData(data, elOrigin);
      this.getView('goal').setUnits(units);
      this.getView('goal').setOrigin(elOriginId);
    },

    onSubmitGoal: function(e) {

      var data = e.data;
      
      function success() {
        location.hash = '#home-goals';
      }

      function failure(ex) {
        this.fire('progress', false);
        ErrorHandler.show('Could not connect');
      }
      
      var that = this;
            
      setTimeout(function() {
        success.call(that);
      }, 1000);
      
      //this.getService('goals').setUserGoal(e.data, success, failure, this);
      
    },

    onActivitySelect: function(e) {      
      this.getView('goal').setData(e.data);
      if (e.data.unit.length === 0) {
        location.hash = '#home-goals/focus/custom-goal';      
      } else {
        location.hash = '#home-goals/focus/goal';      
      }
    }
    
  });

  /**
  @class FocusController
  @extends ViewController
  @bubbles progress
  */
  FocusController = ViewController.extend({
  
    getType: function() {
      return 'focus';
    },

    getBindings: function() {
      return {
        'focus-list': { 'select': this.onActivitySelect }

      }
    },

    onWillAppear: function() {
      if (this.elOrigin === 'Custom') {
        var data = {
                    unit: []
                  };
        this.fire('activity-select', data);
      }
      this._super();
    },

    //@region state handlers

    onDidAppear: function() {
      this.fire('set-title', 'Choose a focus');
      this.getFocuses();
      this._super();      
    },

    //@region public methods

    getFocuses: function() {      
      var activityArr = [];
      for (var i = 0; i < this.data.length; i++) {
        var goal = this.data[i];
        if (goal.tileName === this.elOrigin) {
          activityArr = goal.activities;
          break;
        }
      }
      
      this.getView('focus-list').setData(activityArr);
    
    },

    onActivitySelect: function(e) {
      e.stopPropagation();
      this.fire('activity-select', e.data);      
    },

    setData: function(data, elOrigin) {
      this.data = data;
      this.elOrigin = elOrigin;
    }

  });

  /**
  @class GoalController
  @extends ViewController
  @bubbles progress
  */
  GoalController = ViewController.extend({
    getType: function() {
      return 'goal';
    },

    getBindings: function() {
      return{
        'submit-goal-btn': { 'touchclick': this.$onSubmitGoal }
      }
    },

    onDidAppear: function() {
      this.fire('set-title', 'Set a Goal');
      this._super();
    },

    onToggle: function(e) {
      if (!$(e.currentTarget).hasClass('inactive-toggle')) {
        return;
      }
      this.find('.toggle-button').addClass('inactive-toggle');
      $(e.currentTarget).removeClass('inactive-toggle');
    },

    setUnits: function(units) {
      this.setParam('units', units);
    },

    setOrigin: function(originId) {
      this.originId = originId;
    },
    

    setData: function(data) {
      
      this.data = data;     
        
      /* Setup Toggle Segmented Control */
      var units = this.getParam('units');
      var toggles = [];
      for (var i = 0; i < this.data.unit.length; i++) {
        toggles.push(units[this.data.unit[i]].unitName);
      }

      if (toggles.length === 0) {
        toggles.push('Custom Goal');
        this.find('.custom').show();
        this.find('.toggle-wrapper').hide();
      }
      else {
        this.find('.custom').hide();
        this.find('.toggle-wrapper').show();
      }
        
      var toggleBtn = this.find('.toggle-button-template');
      this.find('.toggle-button').remove();
      for (i = 0; i < toggles.length; i++) {
        var newToggle = this.find('.toggle-button-template').clone().addClass('toggle-button')
          .removeClass('toggle-button-template').removeClass('hidden').val(toggles[i]);
        this.find('.toggle-wrapper').append(newToggle);
        if (i > 0) {
          newToggle.addClass('inactive-toggle');
        }
        newToggle.on('click', proxy(this.onToggle, this));
      }
                
      //this.find('.toggle-button-template').remove();
      
    },

    $onSubmitGoal: function() {
      this.fire('set-title', 'Set Your Goals');
      // get value from text boxes and call service
      var params = {};
      params.value = this.find('.amount-textbox').val();
      var units = this.getParam('units');
      params.unitId = 0;
      for (var i = 0; i < units.length; i++) {
        if (units[i].unitName === this.find('.toggle-button').not('.inactive-toggle').val()) {
          params.unitId = units[i].id;
          break;
        }
      }      
      params.categoryId = this.data.id;
      params.username = StorageManager.GetObject(Constants.Username);
      params.id = this.originId * 1;
      this.fire('submit-goal', params);
    }
    
  });

  /**
  @class GoalsModalController
  @extends ModalViewController
  **/

  GoalsModalController = ModalViewController.extend({
    getType: function() {
      return 'focus-modal';
    },

    setRoute: function(routes) {
      for (var view in this._views) {
        this._views[view].setRoute(routes);
      }
    },

    setData: function(data, elOrigin, elOriginId, units) {
      for (var view in this._views) {
        this._views[view].setData(data, elOrigin, elOriginId, units);
      }
    },
    
  });

  /**
  @class HomeGoalsController
  @extends ViewController
  @bubbles progress
  */
  HomeGoalsController = ViewController.extend({
    getType: function() {
      return 'home-goals';
    },

    getBindings: function() {
      return{
        'update-progress-btn': { 'click': this.updateGoals },
        '$target(.goal-set-btn)': { 'click': this.onSetBtn },
        'focus-modal': { 'close-focus-modal': this.onCloseFocusModal },
        'focus-modal': { 'customgoalsettingthing': this.doSomething }
      }
      
    },

    getDefaultRoute: function() {
      return 'home-goals';
    },

    getRoutes: function() {
    
      function onFocus(current, routes) {
        if (current === 'home-goals') {
          this.getView('focus-modal').presentModalView();
        }
        else if (current === 'focus') {
          this.getView('focus-modal').setRoute(routes);
        }
      }

      function onHomeGoals(current, routes) {
        this.refresh();
        this.getView('focus-modal').dismissModalView();
      }
      
      return {
        'home-goals': onHomeGoals,
        'focus': onFocus
      };
    },

    setup: function() {
      this.addView(GoalsModalController, 'focus-modal', 'focus-modal', 'focus-manager.html', true);
      if (!this.hasOwnProperty('template') || !this.template) {
        this.template = this.target.find('[itemscope]').outerHTML();
      }
      this.target.find('[itemscope]').remove();
    },

    onWillAppear: function() {
      this.target.find('[itemscope]').remove();
      this._super();
    },

    onDidAppear: function() {
      this.getUnits();      
      this.refresh();
      this._super();
    },

    onDidLoad: function() {
      this.fire('show-back');      
      this._super();
    },

    refresh: function() {
      
      function success(data) {

        this.setParam('goalData', data);
        var tileWrapper = this.find('.tile-wrapper');
        tileWrapper.empty();
        var tile = null;
        var tiles = [];

        for (var i = 0; i < data.length; i++) {
          
          tile = $(this.template);
          if (data[i].hasOwnProperty('id')) {
            tile.attr('itemid', data[i].id);
            tile.addClass('not-set');
            tile.find('.goal-set-btn').attr('name', data[i].tileName);
          }
          for (var prop in data[i]) {
            itemprop = tile.find('[itemprop="' + prop + '"]');
            if (itemprop.length && $(itemprop).get(0).tagName === 'INPUT') {
              itemprop.val(data[i][prop]);
            } else if (itemprop) {
              itemprop.text(data[i][prop]);
            }
          }          
          
          tiles.push(tile.outerHTML());
          if (i%2 === 1) {
            tileWrapper.append(tiles.join(''));
            tiles = [];
          }
        }
        
        this.fire('progress', false);
        this.getUserGoals();

      }

      function failure(ex) {
        this.fire('progress', false);
        ErrorHandler.show('Could not connect');
        this.getUserGoals();
      }
      
      this.updateCounter = 0;
      this.fire('progress', true);
            
      this.getService('goals').getGoals(success, failure, this);
    },

    onSetBtn: function(e) {
      this.currentActivity = $(e.target).attr('name');
      this.getView('focus-modal').setData(this.getParam('goalData'), $(e.target).attr('name'), $(e.target).closest('.tile').attr('itemid'), this.getParam('units'));
      location.hash = '#home-goals/focus';
    },    

    onCloseFocusModal: function() {
      this.getView('focus-manager').dismissModalView();      
    },

    getCustomUserGoals: function() {
      
      function success(data) {
        this.setParam('customUserGoal', data);
        var el = this.find('.tile[itemid="3"]');
        if (data.name) {          
          el.find('.activity-name').text(data.name).show();
          el.find('.goal-input').attr('placeholder', data.value + ' ' + data.unit).show();
          el.find('.set-goal-spacing').hide();
          el.find('.goal-set-btn').hide();
          el.removeClass('not-set');
        }
        else {
          this.find('.set-goal-spacing').show();
          this.find('.goal-set-btn').show();
          el.find('.activity-name').hide();
          el.find('.goal-input').hide();
        }

        if (this.find('.not-set').length > 0) {
          this.find('.update-btn-wrapper').hide();
        }
        else {
          this.find('.update-btn-wrapper').show();
        }
        
      }

      function failure(ex) {
        this.fire('progress', false);
        ErrorHandler.show('Could not connect');      
      }

      this.getService('goals').getCustomUserGoal(StorageManager.GetObject(Constants.Username), success, failure, this);
    },

    getUserGoals: function() {
      function success(data) {
        this.setParam('userGoals', data);
        var goalData = this.getParam('goalData');
        var units = this.getParam('units');
        this.find('.set-goal-spacing').show();
        this.find('.goal-set-btn').show();
        for (var i = 0; i < data.length; i++) {
          var el = this.find('.tile[itemid="' + data[i].category + '"]');   
          el.removeClass('not-set');
          var activities = goalData[data[i].category].activities;
          var item;
          for (var j = 0; j < activities.length; j++) {
            if (activities[j].id === data[i].item) {
              item = activities[j];
              break;
            }
          }          
          var unit = units[data[i].unit];
          el.find('.activity-name').text(item.name).show();
          el.find('.set-goal-spacing').hide();
          el.find('.goal-set-btn').hide();
          el.find('.goal-input').attr('placeholder', data[i].value + ' ' + unit.unitName).show();// val(data[i].value + ' ' + unit.unitName).show();
          el.attr('goalId', data[i].id);
        }
        this.getCustomUserGoals();
      }

      function failure(ex) {
        this.fire('progress', false);
        ErrorHandler.show('Could not connect');
        this.getCustomUserGoals();
      }

      this.getService('goals').getUserGoals(StorageManager.GetObject(Constants.Username), success, failure, this);

    },

    getUnits: function() {
      function success(data) {
        this.setParam('units', data);        
      }

      function failure() {
        this.fire('progress', false);
        ErrorHandler.show('Could not connect');
      }

      this.getService('goals').getUnits(success, failure, this);
    },   

    updateGoals: function() {
    
      var userGoals = this.getParam('userGoals');
      var units = this.getParam('units');      
      
      for (var i = 0; i < userGoals.length; i++) {
        var params = {};
        params.value = this.find('.tile[goalId="' + userGoals[i].id + '"]').val();
        params.id = userGoals[i].id;
        this.getService('goals').updateUserGoal(params, success, failure, this);
      }      

      function success() {
        this.updateCounter++;
        if (this.updateCounter === userGoals.length) {
          updateCustomGoal();
        }
      }

      function failure(ex) {
        this.fire('progress', false);
        ErrorHandler.show('Could not connect');
        this.getUserGoals();
      }
      
    },

    updateCustomGoal: function() {
      function success() {
        ErrorHandler.show('Goals updated!');
      }
      function failure(ex) {
        this.fire('progress', false);
        ErrorHandler.show('Could not connect');
        this.getUserGoals();
      }
      var customGoal = this.getParam('customUserGoal');
      var params = {};
      params.value = this.find('.tile[goalId="' + customGoal.id + '"]').val();
      params.id = customGoal.id;
      this.getService('goals').updateCustomUserGoal(params, success, failure, this);
    }
  });


  /**
  @class SimpleListController
  @extends ViewController
  @fires select
  @fires next
  */
  SimpleListController = ViewController.extend({

    // @region Configuration

    getType: function() {
      return 'simple-list';
    },

    setup: function() {

      if (!this.hasOwnProperty('template') || !this.template) {
        this.template = this.target.find('[itemscope]').outerHTML();
      }
      this.target.find('[itemscope]').remove();

      if (!this.hasOwnProperty('listWrapper') || !this.listWrapper) {
        this.listWrapper = this.target.find('.list-wrapper').outerHTML();
      }
      this.target.find('.list-wrapper').remove();

    },


    // @region Public Methods
    
    setData: function(data) {

      // store data
      this.listData = data;

      // build list
      if (this._visible) {
        this.build(data);
      }

    },

    build: function(data) {
      this.target.find('.list-wrapper').remove();
      function convertType(type) {
        return Constants.ListTitles[type];
      }

      var typesArr = [];
      for (var i = 0; i < data.length; i++) {
        if ($.inArray(data[i].type, typesArr) === -1) {
          typesArr.push(data[i].type);
        }
      }
      var listsArr = [];
      for (var j = 0; j < typesArr.length; j++) {
        var li = null, listWrapper = $(this.listWrapper).clone(), that = this;     
        var list = listWrapper.find('.list');
        listWrapper.find('.focus-list-title').text(convertType(typesArr[j]));
        // clear list
        list.empty();

        var itemprop;

        // bind list of data
        for (var i = 0; i < data.length; i++) {
          if (data[i].type !== typesArr[j]) {
            continue;
          }
          li = $(this.template);
          try {
            if (li.length) {
              li.html(Mustache.to_html(li.html(), data[i]));
            }
          } catch (e) { }
          li.attr('itemid', data[i]['id']);
          for (var prop in data[i]) {
          
            itemprop = li.find('[itemprop="' + prop + '"]');
            if (itemprop) {
              itemprop.text(data[i][prop]);
            }
          }
          
          list.append(li);
        }
        listWrapper.append(list);
        listsArr.push(listWrapper);
      }
      this.getElement('list').remove();
      for (var k = 0; k < listsArr.length; k++) {
        this.target.append(listsArr[k].outerHTML());
      }
      this.target.find('li').on('click', $.proxy(this.$onSelect, this));


    },

    clear: function() {
      this.listData = [];
      this.getElement('list').empty();
    },


    // @region State Handlers

    onDidAppear: function() {
      if (this.listData && this.listData.length > 0) {
        this.build(this.listData);
      } else {
        this.getElement('list').empty();
      }
      
      this._super();
    },


    // @region DOM Listeners

    $onSelect: function(e) {
      e.stopPropagation();
      if (Object.keys(this.listData).length === 0) { return; }
      var id = $(e.currentTarget).closest('[itemid]').attr('itemid') * 1;
      if (this.listData) {
        var data = null;
        for (var i = 0; i < this.listData.length; i++) {
          if (this.listData[i].id === id) {
            data = this.listData[i];
            break;
          }
        }
        this.fire('select', data);
      }
    }

  });

  // @region Exports

  exports.WTController = WTController;
  exports.LoginController = LoginController;
  exports.FocusManagerController = FocusManagerController;
  exports.FocusController = FocusController;
  exports.GoalsModalController = GoalsModalController;
  exports.GoalController = GoalController;
  exports.HomeGoalsController = HomeGoalsController;
  exports.SimpleListController = SimpleListController;


}, ['ui']);
