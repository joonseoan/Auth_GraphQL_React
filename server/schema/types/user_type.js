const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

// 'UserType' here is for reference in js file
const UserType = new GraphQLObjectType({

    // UserType here for Object field name inside of GraphQLObject
    // like this.name = UserType in GraphQLObject
    name: 'UserType',
    fields: {
        id: { type: GraphQLID },
        email: { type: GraphQLString }
    }

});

module.exports = UserType;