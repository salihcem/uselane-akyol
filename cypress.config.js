const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  env: {
    testerName: 'salih.akyol',
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://www.userlane.com/about/careers/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
