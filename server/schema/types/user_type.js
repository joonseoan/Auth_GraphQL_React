const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

// 'UserType' here is for reference in js file
const UserType = new GraphQLObjectType({

    // UserType here for Object field name inside of GraphQLObject
    // like this.name = UserType in GraphQLObject
    name: 'UserType',
    fields: {
        email: { type: GraphQLString }
    }

});

module.exports = UserType;