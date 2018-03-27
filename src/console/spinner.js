const CLI     = require( 'clui' ),
      Spinner = CLI.Spinner,
      spinnerProcess = [ '⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷' ],
      spinner = new Spinner("", spinnerProcess);

module.exports = {
    start: () => { spinner.start(); return spinner; },
    message : (m) => { spinner.message(m); return spinner },
    stop : () => { spinner.stop(); return spinner }
};