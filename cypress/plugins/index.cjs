module.exports = (on, config) => {
    // require('@cypress/code-coverage/task')(on, config);
    on('task',require('@cypress/code-coverage/task'))
    // other configurations or event listeners
    // return config;
  };
  
  console.log("PLGUINS INDEX:CJJS")