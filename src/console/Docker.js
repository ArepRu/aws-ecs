const File    = require( './File' ),
      Profile = require( '../models/Profile' ),
      Questions = require('./Questions'),
      Prompt = require('./Prompt'),
      spinner = require('./spinner'),
      promisify = require( 'util.promisify' ),
      child_process = require( 'child_process' ),
      exec = promisify( child_process.exec ),
      cwd     = process.cwd();

class Docker {
    async build( profile, tag ) {
        const image = profile.repo + ":" + tag,
              repoName = profile.repo.split( 'amazonaws.com/' )[ 1 ];

        spinner.start();
        return exec( 'aws ecr get-login --no-include-email ' )
            .then( function( result ) {
                result = result.stdout ? result.stdout.replace( "-e none", "" ) :
                         result.replace( "-e none", "" );
                return exec( result );

            } ).then( function( res ) {
                spinner.message( "Building image '" + tag + "' from docker file '" + profile.dockerfile + "'" );

                return exec( 'docker build -f ' + profile.dockerfile + ' -t ' + repoName + ' .' )
            } ).then( function( res ) {
                spinner.message( "Tagging image '" + tag + "' from docker file '" + profile.dockerfile + "'" )

                return exec( 'docker tag ' + repoName + ' ' + image );
            } ).then( function( res ) {
                // console.log("Pushing image '" + tag + "' from docker file '" + profile.dockerfile + "'");
                spinner.stop();

                return new Promise( (resolve, reject) => {
                    const push = child_process.exec('docker push ' + image).stdout.pipe(process.stdout);

                    push.on('error', (data) => {
                        reject( data );
                    });

                    push.on('exit', (code) => {
                        resolve(code);
                    });
                });
            } ).then( function( res ) {
                spinner.stop();
            } )
    }

    async push( region, args ) {
        const profile   = new Profile(),
              fileExist = await new File( cwd + "/Dockerfile" ).exists();

        if( !fileExist ) {
            console.log( 'Dockerfile not found' );
            return false;
        }

        profile.regionECR = region;

        const q = new Questions( {profile : profile} );
        await q.ask([ q.types.repo ], args);

        const tag = await Prompt.input('tag', 'Enter tag:', 'latest');

        const confirm = await Prompt.confirm('confirm', "Do you want to push docker image?")

        if (confirm) {
            await this.build( profile, tag );

            console.log( 'Docker image pushed successfully' );
        }
    }
}

module.exports = new Docker();