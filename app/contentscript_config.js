require.config({
  shim: {
    "amplify": {
        exports: "amplify"
    }
  },
  paths: {
    amplify: 'app/bower_components/amplify/lib/amplify.core',
    underscore: 'app/bower_components/underscore/underscore',
    superagent: 'app/bower_components/superagent/superagent'
  },
  packages: [
 
  ]
});