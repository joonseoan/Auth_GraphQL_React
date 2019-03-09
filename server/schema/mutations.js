const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString } = graphql;

const UserType = require('./types/user_type');
const AuthService = require('../services/auth');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            // 1)
            // resolve(parentValue, args, request) {
            // 2)
            resolve(parentValue, { email, password }, req) {

                /* 
                    // from services/auth
                    function signup({ email, password, req }) {

                    const user = new User({ email, password });
                    if (!email || !password) { throw new Error('You must provide an email and password.'); }

                    return User.findOne({ email })
                        // If a user already exists, generate an error and stop here
                        .then(existingUser => {
                        if (existingUser) { throw new Error('Email in use'); }
                        // if the user does not exists, store the new user in mongoDB  
                        return user.save();
                        })
                        // If the new user is stored,
                        .then(user => {
                        // By using promise,
                        return new Promise((resolve, reject) => {
                            // run login function in req
                            req.logIn(user, (err) => {
                            // If error occurs, stop here
                            if (err) { reject(err); }
                            // After login, return uers
                            resolve(user);
                            });
                        });
                        });
                    }
                
                */

               // req: req of http/https
                console.log('request: ', req);
                
                // without 'return', we can't get the result back to graphql from mongoDB.
                return AuthService.signup({ email, password, req });
            }
            
        },
        logout: {
            type: UserType,
            resolve(parentValue, args, req) {

                // req.user is automatically exposed from passport.js to node.
                //      Hence, we do not need to difine the one.

                // In this application, we weill get the current user first before logout.
                //  because After logout, we can not get req.user
                const { user } = req;
                req.logout();
                return user
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) {
                return AuthService.login({ email, password, req });
            }
        }
    }
});

module.exports = mutation;
