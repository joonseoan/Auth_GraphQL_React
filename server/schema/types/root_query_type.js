const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID  } = graphql;

const UserType = require('./user_type');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',

  // To find the current user that hss signed in the app.
  fields: {
    user: { 
      type : UserType,
      resolve(parentValue, args, req) {
        // req.user is populated from passport.js
        // no user has signed in => return value is null

        /*
         
          {
            "data": {
              "user": null
            }
          }
        
        */
        return req.user;
      }
    
    }
  }
});

module.exports = RootQueryType;
