const { Record } = require( 'type-r' ),
      AWS        = require( "aws-sdk" ),
      Profile = require('./Profile');

const Task = Record.extend({
    defaults : {
        region : String,
        cluster : String
    },

    async register( profile, tag ) {
        const definition = {
            "networkMode"          : "bridge",
            "family"               : profile.task,
            "volumes"              : [],
            "containerDefinitions" : [ {
                "environment"      : profile.env,
                "name"             : profile.task,
                "image"            : profile.repo + ":" + tag,
                // "memory"           : profile.container_memory,
                "memoryReservation": profile.container_memory,
                "cpu"              : profile.cpu_units,
                "mountPoints"      : [],
                "portMappings"     : [ {
                    "protocol"      : "tcp",
                    "hostPort"      : profile.host_port,
                    "containerPort" : profile.app_port
                } ],
                // "logConfiguration" : {
                //     "logDriver" : "awslogs",
                //     "options"   : {
                //         "awslogs-group"  : profile.log,
                //         "awslogs-region" : profile.region
                //     }
                // },
                "essential"        : true,
                "volumesFrom"      : []
            } ]
        };

        AWS.config.update( {
            region : this.region
        } );

        const ecs = new AWS.ECS();

        return new Promise( ( resolve, reject ) => {
            ecs.registerTaskDefinition( definition, ( err, data ) => {
                if( err ) {
                    return reject( err );
                }

                resolve( data.taskDefinition.taskDefinitionArn );
            });
        })
    },

    async list(){
        AWS.config.update( {
            region : this.region
        } );

        const ecs = new AWS.ECS();

        return new Promise( ( resolve, reject ) => {
            ecs.listTasks( {
                cluster    : this.cluster
            }, ( err, data ) => {
                if( err ) {
                    reject( "Problem loading tasks" );
                    return false;
                }
                resolve( data && data.taskArns || [] );
            } );
        } )
    },

    async describeList( list = [] ) {
        AWS.config.update( {
            region : this.region
        } );

        const ecs = new AWS.ECS();

        return new Promise( ( resolve, reject ) => {
            if ( !list.length ){
                resolve(tasks);
                return false;
            }

            ecs.describeTasks( {
                cluster    : this.cluster,
                tasks    : list
            }, ( err, data ) => {
                if( err ) {
                    reject( "Problem loading existing probes" );
                }
                resolve( data ? data.tasks : [] );
            } )
        } )
    },

    async describe() {
        AWS.config.update( {
            region : this.region
        } );

        const ecs = new AWS.ECS();

        return new Promise( ( resolve, reject ) => {
            ecs.describeTaskDefinition( {
                taskDefinition : this.id
            }, ( err, data ) => {
                if( err ) {
                    return reject( "Problem loading tasks" );
                }
                resolve( data.taskDefinition );
            } );
        } )
    }
});

module.exports = Task;