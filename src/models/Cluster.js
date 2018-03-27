const { Record } = require( 'type-r' ),
      AWS        = require( "aws-sdk" ),
      Task       = require( './Task' );

const Cluster = Record.extend( {
    defaults : {
        region : String
    },

    async list() {
        AWS.config.update( {
            region : this.region
        } );

        const ecs = new AWS.ECS();

        return new Promise( ( resolve, reject ) => {
            ecs.listClusters( {
                maxResults : 100
            }, ( err, data ) => {
                if( err ) {
                    reject( "Problem loading clusters" );
                }
                resolve( data.clusterArns );
            } );
        } );
    },

    async portsUsed() {
        AWS.config.update( {
            region : this.region
        } );

        const ecs  = new AWS.ECS(),
              task = new Task( { region : this.region, cluster : this.id } );

        return task
            .list()
            .then( tasks => task.describeList( tasks ) )
            .then( tasks => {
                let ports = [];
                tasks.map( t => t.containers.map( c => c.networkBindings.forEach( n => {
                    ports.push( n.hostPort );
                } ) ) );

                return ports;
            } );
    }

} )

module.exports = Cluster;