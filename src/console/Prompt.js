const inquirer = require( 'inquirer' );

const compare = ( a, b ) => {
    return a.name < b.name
        ? -1
        : a.name > b.name
               ? 1
               : 0;
};

class Prompt {
    async prompt( prompt, arg ) {
        if( arg && arg[ prompt.name ] ) {
            return arg[ prompt.name ];
        }
        return inquirer.prompt( prompt ).then( answer => answer[ prompt.name ] );
    }

    input( name, message, value = null, validate, arg = null ) {
        return this.prompt( {
            type     : 'input',
            name     : name,
            default  : value,
            message  : message,
            validate : !!validate ? validate : void(0)
        }, arg )
    }

    confirm(name, message, value = false, arg = null){
        return this.prompt( {
            type     : 'confirm',
            name     : name,
            default  : value,
            message  : message
        }, arg )
    }

    contourSelect( value, arg = null ) {
        return this.prompt( {
            type    : 'list',
            name    : 'contour',
            message : 'Select contour:',
            default : value,
            choices : [
                {
                    name  : "Test/QA",
                    value : "test"
                },
                {
                    name  : "Demo",
                    value : "demo"
                }
            ],
        }, arg );
    }

    regionSelect( value, arg = null ) {
        return this.prompt( {
            type    : 'list',
            name    : 'region',
            message : 'Select region:',
            default : value,
            choices : [
                {
                    name  : "California",
                    value : "us-west-1"
                },
                {
                    name  : "Ohio",
                    value : "us-east-2"
                },
                {
                    name  : "Virginia",
                    value : "us-east-1"
                },
                {
                    name  : "Oregon",
                    value : "us-west-2"
                }
            ],
        }, arg );
    }

    repositorySelect( repositories, value = null, arg = null ) {
        return this.prompt( {
            type    : 'list',
            name    : 'repo',
            message : 'Select repository:',
            default : value,
            choices : repositories.map( function( repo ) {
                return {
                    name  : repo.repositoryName,
                    value : repo.repositoryUri
                }
            } ).sort( compare ),
        }, arg )
    }

    serviceSelect(services, value = null, arg = null ) {
        return this.prompt({
            type    : 'list',
            name    : 'service',
            message : 'Select service:',
            choices : services.map( service => {
                return {
                    name  : service.split( "service/" )[ 1 ],
                    value : service
                }
            } )
        }, arg)
    }

}

module.exports = new Prompt();