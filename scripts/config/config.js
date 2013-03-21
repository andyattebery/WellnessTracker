/**
 config.js | 3.5.2013 | v1.0
 WMP Wellness Tracker
 Copyright 2013 West Monroe Partners, LLC
 */

Clementine.config({
  name: 'wt',
  paths: {
    DEV: 'http://localhost/wellness/WellnessTracker/',
    PROD: 'http://wmpwellnesstracker.azurewebsites.net/api/'
  },
  env: 'DEV',
  auth: '',
  services: ['goals'],
  views: [
    'login.html',
    'focus-manager.html',
    'focus.html',
    'goal.html',
    'goals.html'
  ],
  required: [    
    'wt-models',
    'wt-services',
    'wt-controllers'
  ]
});
