#! /usr/bin/env node
const yargs = require( 'yargs' );

const Deploy       = require( './src/console/Deploy' ),
      spinner      = require( './src/console/spinner' ),
      Docker       = require( './src/console/Docker' );

let argv = yargs
    .help()
    .argv;

const commandExist = ( cmd ) => argv._.indexOf( cmd ) > -1,
      error        = ( err ) => {
          spinner.stop();
          console.log( '\x1b[31m%s\x1b[0m',  err )
      };

if( commandExist( 'push' ) ) {
    Docker.push( 'us-west-2', argv ).then().catch( error );
}
// } else if ( commandExist( 'init' ) ) {
//     new Deploy().configure().then();
// } else if ( commandExist( 'deploy' ) ) {
//     new Deploy( argv.profile ).do( argv ).then();
else {
    yargs.showHelp();
}