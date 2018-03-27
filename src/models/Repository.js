const { Record } = require( 'type-r' ),
      AWS        = require( "aws-sdk" );

const Repository = Record.extend( {
    defaults : {
        region : String
    },

    list() {
        const ecr = new AWS.ECR( { region : this.region } );

        return new Promise( ( resolve, reject ) => ecr.describeRepositories( {
                maxResults : 100
            }, ( err, data ) => {
                if( err ) {
                    reject( "Problem loading repositories" + (err.message && ': ' + err.message || ''));
                }
                resolve( data.repositories );
            } )
        )
    }
} );

module.exports = Repository;