const { Record, attributes } = require( 'type-r' );
const fs = require( "fs" );

const Profile = Record.extend( {
    defaults : {
        contour          : String,
        dockerfile       : String.value( 'Dockerfile' ),
        region           : String,
        regionECR        : String,
        profile          : String,
        repo             : String,
        tag              : String,
        cluster          : String,
        task             : String,
        service          : String,
        log              : String,
        container_memory : Number.value( 1024 ),
        cpu_units        : Number.value( 0 ),
        host_port        : Number.value( 8080 ),
        app_port         : Number.value( 8080 ),
        env              : Array.value( [] )
    },

    // TODO add try/catch
    load(path) {
        return new Profile( require(path) );
    },

    save(path) {
        const json = this.toJSON();

        return new Promise( function( resolve, reject ) {
            fs.writeFile( path, JSON.stringify( json, null, 4 ), ( err ) => {
                if( err ) {
                    return reject( "Could not save configuration file." )
                }

                resolve( true )
            } );
        } )
    }
} );

// const ex = attributes({
//     contour : String,
//     dockerfile : String.value('Dockerfile')
// });

module.exports = Profile;