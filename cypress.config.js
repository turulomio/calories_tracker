import { defineConfig } from "cypress";
// import registerCodeCoverageTasks from "@cypress/code-coverage/task.js"

// import * as babelrc from "@cypress/code-coverage/use-babelrc.js"
// console.log(babelrc)

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
    // test: {
    //   plugins: ['istanbul']
    // },
    codeCoverage: {
      url: "http://127.0.0.1:3000/__coverage__",
    },
  },

  // e2e: {
  //   async setupNodeEvents(on, config) {
  //     // implement node event listeners here
  //     registerCodeCoverageTasks(on,config)

  //     //  on('file:preprocessor', babelrc.default)
  //     return config;
  //   },
  // },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
