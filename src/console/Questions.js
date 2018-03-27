const { Record } = require( 'type-r' );

const Profile    = require( '../models/Profile' ),
      Prompt     = require( './Prompt' ),
      Repository = require( '../models/Repository' ),
      Service    = require( '../models/Service' ),
      spinner    = require( './spinner' );

const Questions = Record.extend( {
    defaults : {
        profile : Profile
    },

    get types() {
        return {
            region  : 'region',
            repo    : 'repo',
            service : 'service',
            dockerfile : 'dockerfile',
        }
    },

    async ask( list, args ) {
        for (let i = 0; i < list.length; i++) {
            switch (list[ i ]) {
                case this.types.region :
                    this.profile.region = await Prompt.regionSelect( this.profile.region, args );
                    break;
                case this.types.repo :
                    spinner.message( "Connecting to ECR").start();
                    const repos = await new Repository( { region : this.profile.regionECR } ).list();
                    spinner.stop();
                    this.profile.repo = await Prompt.repositorySelect( repos, this.profile.repo, args );
                    break;
                case this.types.service :
                    spinner.message( "Loading service list" ).start();
                    const services = await new Service(
                        { region : this.profile.region, cluster : this.profile.cluster } ).list();
                    spinner.stop();
                    this.profile.service = await Prompt.serviceSelect( services, null, args );
                    break;
                case this.types.dockerfile:
                    this.profile.dockerfile = await Prompt.input('dockerfile', '', this.profile.dockerfile, null, args);
                    break;
            }
        }

        return this.profile;
    }
} )

module.exports = Questions;