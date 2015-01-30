require.config({
  shim: {
    "amplify": {
        exports: "amplify"
    }
  },
  paths: {
    amplify: '../bower_components/amplify/lib/amplify.core',
    underscore: '../bower_components/underscore/underscore',
    superagent: '../bower_components/superagent/superagent'
  },
  packages: [
 
  ]
});