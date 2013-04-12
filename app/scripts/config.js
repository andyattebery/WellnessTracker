/**
 config.js | 4.7.2013 | v1.0
 West Monroe Wellness Tracker
 Copyright 2012 West Monroe Partners, LLC
 */

Clementine.config({
  name: 'wellness',
  paths: {
    DEV: 'http://localhost:3860',
    PROD: 'http://fitnesschallengetrackerapi.azurewebsites.net'
  },
  env: 'PROD',
  services: ['wt'],
  views: ['login.html', 'goals.html', 'goal-setup.html'],
  required: ['wt.objects', 'wt.services', 'wt.controllers']
});

var Browser = {
  isAndroid: (/android/gi).test(navigator.appVersion),
  isIDevice: (/iphone|ipad/gi).test(navigator.appVersion),
  isPlaybook: (/playbook/gi).test(navigator.appVersion),
  isTouchPad: (/hp-tablet/gi).test(navigator.appVersion),
  touch: (/android/gi).test(navigator.appVersion) || (/iphone|ipad/gi).test(navigator.appVersion),
  scroll: (navigator.userAgent.match(/ Desire_A8181/i) || navigator.userAgent.match(/ myTouch4G/i) || navigator.userAgent.match(/ ADR6200/i) || navigator.userAgent.match(/ Nexus 7/i)) || ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) && (navigator.userAgent.match(/ OS 5_/i) || navigator.userAgent.match(/ OS 6_/i))) || (!(/iphone|ipad/gi).test(navigator.appVersion) && !(/android/gi).test(navigator.appVersion))
};

var ErrorHandler = {

  init: function() {
    this.target = $("#error");
    this.target.addClass('hidden');
  },

  show: function(message, image) {
    this.target.text(message);
    if (image) {
      this.target.addClass('icon');
      this.target.css('background-image', 'url(' + image + ')');
    } else {
      this.target.removeClass('icon');
      this.target.css('background-image', 'none');
    }
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

Array.prototype.last = function() {
  return this[this.length-1];
};
