// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

var events = require('events');
events.EventEmitter.defaultMaxListeners = 30; // Increase the default max listeners globally

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-junit-reporter'),
    ],
    client: {
      clearContext: true, // close Jasmine Spec Runner output in browser to avoid 'Some of your tests did a full page reload!' error when '--no-watch' is active
      jasmine: {
        random: false,
      },
    },
    reporters: ['progress', 'kjhtml', 'dots', 'junit'],
    junitReporter: {
      outputFile: 'unit-test-storefront.xml',
      outputDir: require('path').join(__dirname, '../../unit-tests-reports'),
      useBrowserName: false,
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/storefront'),
      reporters: [{ type: 'lcov', subdir: '.' }, { type: 'text-summary' }],
      check: {
        global: {
          statements: 85,
          lines: 85,
          branches: 70,
          functions: 80,
        },
      },
    },
    captureTimeout: 600000,
    browserDisconnectTolerance: 5,
    browserDisconnectTimeout: 600000,
    browserNoActivityTimeout: 600000,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: ['--headless', '--no-sandbox', '--remote-debugging-port=9001'],
      },
    },
    singleRun: false,
  });
};
