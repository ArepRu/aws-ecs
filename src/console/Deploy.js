const Profile = require('../models/Profile'),
      Questions = require('./Questions');

class Deploy {
    constructor( profile = null ) {
        if ( profile ) {
            this.profile = new Profile().load( profile );
        } else {
            this.profile = new Profile()
        }
    }

    async configure( args, saveFile = true ) {
        const Qs = new Questions( { profile : this.profile } );
        await Qs.ask( [ Qs.types.region, Qs.types.repo ], args );
    }

    async do( args ){
    }
}

module.exports = Deploy;