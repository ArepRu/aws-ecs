const fs = require( "fs" );
const cwd = process.cwd();

class File {
    constructor( path ){
        this.path = path;
    }

    exists() {
        return new Promise( ( resolve, reject ) => {
            fs.stat( this.path, ( err, stat ) => {
                if( err ) {
                    return reject( err );
                }

                resolve( true );
            } );
        } )
    }

    loadFile() {
        return new Promise( ( resolve, reject ) => {
            try {
                var data = require( this.path );
            } catch (e) {
                return reject( e );
            }

            return resolve( data );
        } )
    }

    save( data ) {
        return new Promise( ( resolve, reject ) => {
            fs.writeFile( this.path, JSON.stringify( data, null, 4 ), function( err ) {
                if( err ) {
                    return reject( "Could not save configuration file." )
                }

                resolve( true )
            } );
        } )
    }
}

module.exports = File;