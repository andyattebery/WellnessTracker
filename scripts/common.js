/**
 common.js | 3.5.2012 | v1.0
 WMP Wellness Tracker
 Copyright 2013 West Monroe Partners, LLC
 */


// Wrapper Communication

// Date Prototype Extensions

Date.prototype.getShortDateString = function(daysToAdd) {
	var day;
	if (!daysToAdd) {
		daysToAdd = 0;
	}
	this.setDate(this.getDate() + daysToAdd);
	return (this.getMonth() + 1) + "/" + this.getDate() + "/" + this.getFullYear();
};


// User Agent Checks

var Browser = {
  isAndroid: (/android/gi).test(navigator.appVersion),
  isIDevice: (/iphone|ipad/gi).test(navigator.appVersion),
  isPlaybook: (/playbook/gi).test(navigator.appVersion),
  isTouchPad: (/hp-tablet/gi).test(navigator.appVersion),
  touch: (/android/gi).test(navigator.appVersion) || (/iphone|ipad/gi).test(navigator.appVersion),
  scroll: (navigator.userAgent.match(/ Desire_A8181/i) || navigator.userAgent.match(/ myTouch4G/i) || navigator.userAgent.match(/ ADR6200/i) || navigator.userAgent.match(/ Nexus 7/i)) || ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) && (navigator.userAgent.match(/ OS 5_/i) || navigator.userAgent.match(/ OS 6_/i))) || (!(/iphone|ipad/gi).test(navigator.appVersion) && !(/android/gi).test(navigator.appVersion))
};


// Error Messages

var ErrorHandler = {

  init: function() {
    this.target = $("body > .error");
    this.target.addClass('hidden');
  },

  show: function(message) {
    this.target.text(message);
    this.target.removeClass('hidden');
    setTimeout(proxy(function() {
      this.target.addClass('visible');
    }, this), 50);
    var that = this;
    setTimeout(function() {
      that.target.removeClass('visible');
      setTimeout(function() {
        that.target.addClass('hidden');
      }, 500);
    }, 1800);
  }

};


// Local Storage

var StorageManager = {
    
  Initialize: function(version) {
    
    var v = StorageManager.GetObject('appversion');
    
    if (!v || version !== version) {
      localStorage.clear();
      StorageManager.SetObject('appversion', version);
    }
    
    var expiration = StorageManager.GetObject('appExpiration');
    window.expiration = expiration;
    
  },
  
  GetObject: function(key) {
    var item;
    if (typeof localStorage.getItem(key) !== 'undefined') {
      var val = localStorage.getItem(key);
      if (!val) { return; }
      try {
        item = JSON.parse(val);
      } catch(e) {
        item = val;
      }
      if (item.ttl === -1 || item.ttl > ((new Date()).getTime())) {
        return item.value;
      } else {
        localStorage.removeItem(key);
      }
    }
  },
  
  SetObject: function(key, value, ttl) {
    value = {
      value: value,
      ttl: ttl ? ttl + ((new Date()).getTime()) : -1
    };
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  RemoveObject: function(key) {
      localStorage.removeItem(key);
  }

};


// Application Constants

var Constants = {
  
  /* labels for local storage fields */
  Username: 'email',

  /* month ordinal to name mapping */
  MonthNames : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], 
  
  ListTitles : {
    'min' : 'Less',
    'max' : 'More',
    'target' : 'Activity'
  }
};


// Initialize Local Storage

StorageManager.Initialize('1.0.0');