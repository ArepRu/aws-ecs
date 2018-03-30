const { Record } = require( 'type-r' ),
      AWS        = require( "aws-sdk" );

const Service = Record.extend( {
    defaults : {
        region  : String,
        cluster : String
    },

    async list() {
        AWS.config.update( {
            region : this.region
        } );

        const ecs = new AWS.ECS();

        return new Promise( ( resolve, reject ) => {
            ecs.listServices( {
                maxResults : 100,
                cluster    : this.cluster
            }, ( err, data ) => {
                if( err ) {
                    console.log(err);
                    return reject( "Problem loading services" );
                }
                resolve( data.serviceArns );
            } )
        } );
    },

    async createOrUpdate( taskDef, desiredCount = 1 ) {
        AWS.config.update( {
            region : this.region
        } );

        const ecs    = new AWS.ECS(),
              params = {
                  cluster        : this.cluster,
                  desiredCount   : desiredCount
              };

        if ( taskDef ) {
            params.taskDefinition = taskDef;
        }

        if( this.id.indexOf( "service/" ) > -1 ) {
            params.service = this.id;

            return new Promise( ( resolve, reject ) => {
                ecs.updateService( params, function( err, data ) {
                    if( err ) {
                        return reject( err );
                    }

                    resolve( data );
                } )
            } );
        } else {
            params.serviceName = this.id;
            //params.role = service

            return new Promise( ( resolve, reject ) => {
                ecs.createService( params, function( err, data ) {
                    if( err ) {
                        return reject( err );
                    }

                    resolve( data );
                } )
            });
        }
    },

    async destroy() {
        AWS.config.update( {
            region : this.region
        } );

        const ecs = new AWS.ECS();

        await this.createOrUpdate('', 0);

        return new Promise( ( resolve, reject ) => {
            ecs.deleteService( {
                cluster    : this.cluster,
                service    : this.id
            }, ( err, data ) => {
                if( err ) {
                    console.log(err);
                    return reject( "Problem delete service" );
                }
                resolve( true );
            } );
        } );
    },

    async describe( list = null ) {
        AWS.config.update( {
            region : this.region
        } );

        const ecs = new AWS.ECS();

        return new Promise( ( resolve, reject ) => {
            ecs.describeServices( {
                cluster    : this.cluster,
                services   : list ? list : [this.id]
            }, function( err, data ) {
                if( err ) {
                    return reject( "Problem loading service info" );
                }
                resolve( list ? data.services : data.services[0] );
            } );
        } );
    }
} );

module.exports = Service;