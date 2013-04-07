/**
 config.js | 4.7.2013 | v1.0
 West Monroe Wellness Tracker
 Copyright 2012 West Monroe Partners, LLC
 */

Clementine.config({
  name: 'wmwellness',
  paths: {
    DEV: 'http://localhost:8000',
    STAGE: 'http://localhost:8000',
    QA: 'http://localhost:8000',
    PROD: 'http://localhost:8000'
  },
  env: 'DEV',
  services: [],
  views: [],
  required: ['wt.objects', 'wt.services', 'wt.controllers.wellness']
});

var Browser = {
  isAndroid: (/android/gi).test(navigator.appVersion),
  isIDevice: (/iphone|ipad/gi).test(navigator.appVersion),
  isPlaybook: (/playbook/gi).test(navigator.appVersion),
  isTouchPad: (/hp-tablet/gi).test(navigator.appVersion),
  touch: (/android/gi).test(navigator.appVersion) || (/iphone|ipad/gi).test(navigator.appVersion),
  scroll: (navigator.userAgent.match(/ Desire_A8181/i) || navigator.userAgent.match(/ myTouch4G/i) || navigator.userAgent.match(/ ADR6200/i) || navigator.userAgent.match(/ Nexus 7/i)) || ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) && (navigator.userAgent.match(/ OS 5_/i) || navigator.userAgent.match(/ OS 6_/i))) || (!(/iphone|ipad/gi).test(navigator.appVersion) && !(/android/gi).test(navigator.appVersion))
};