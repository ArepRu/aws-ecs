const { Record } = require( 'type-r' ),
      AWS        = require( "aws-sdk" ),
      Task       = require( './Task' ),
      Service    = require('./Service');

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

        const ecs     = new AWS.ECS(),
              service = new Service( { region : this.region, cluster : this.id } );

        return service
            .list()
            .then( services => service.describe( services ) )
            .then( services => {
                const all = services.map(async (s) => await new Task( { region : this.region, cluster : this.id, id : s.taskDefinition } ).describe());

                return Promise.all( all );

            } )
            .then( tasks => {
                let ports = [];

                tasks.map( td => td.containerDefinitions.map(t => t.portMappings.map( p => { ports.push( p.hostPort ) } )));

                return ports;
            } );
    }

} )

module.exports = Cluster;