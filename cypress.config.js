import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,

  // e2e: {
  //   setupNodeEvents(on, config) {
  //     // implement node event listeners here
  //     // e2e: {
  //     //   baseUrl: 'http://localhost:8012/calories_tracker/'
  //     // }
  //   },
  // },
  env: {
    codeCoverage: {
      url: "http://localhost:3000/__coverage__",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
