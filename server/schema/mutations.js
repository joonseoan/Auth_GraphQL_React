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
                // return must be placed here because AuthService.signup was using promise.
                // Like this to get a value
                // reutrn function signup({ email, password, req }) {

                    // const user = new User({ email, password });
                    // if (!email || !password) { throw new Error('You must provide an email and password.'); }

                    // return User.findOne({ email })
                    //     // If a user already exists, generate an error and stop here
                    //     .then(existingUser => {
                    //     if (existingUser) { throw new Error('Email in use'); }
                    //     // if the user does not exists, store the new user in mongoDB  
                    //     return user.save();
                    //     })
                    //     // If the new user is stored,
                    //     .then(user => {
                    //     // By using promise,
                    //     return new Promise((resolve, reject) => {
                    //         // run login function in req
                    //         req.logIn(user, (err) => {
                    //         // If error occurs, stop here
                    //         if (err) { reject(err); }
                    //         // After login, return uers
                    //         resolve(user);
                    //         });
                    //     });
                    //     });
                    // }
                
                // without 'return', we do not know when 'AuthService.signup' runs
                return AuthService.signup({ email, password, req });
            }
        }
    }
});

module.exports = mutation;

// const graphql = require('graphql');

// const UserType = require('./types/user_type');
// const AuthService = require('../services/auth');

// const { 

//     GraphQLObjectType,
//     GraphQLString

// } = graphql;

// const mutation = new GraphQLObjectType({

//     name: 'Muatation',
//     fields: {
//         signup: {
//             type: UserType,
//             args: {
//                 email: { type: GraphQLString },
//                 password: { type: GraphQLString }
//             },

//             // request from req of node
//             // es6: {email, password }
//             //resolve(parentValue, args, request) {
//             resolve(parentValue, { email, password }, req) {
//                 return AuthService.signup({email, password, req});
//             }
//         },
//         logout: {
//             type: UserType,
//             resolve(parentValue, args, req) {

//                 // passport.js automatically populates req.user!!! Please, keep in mind of this.
//                 const { user } = req;

//                 // Then logout method from passport.js
//                 req.logout();

//                 // return the user that logged out.
//                 return user;
//             }
//         },
//         login: {
//             type: UserType,
//             args: {
//                 email: { type: GraphQLString },
//                 password: { type: GraphQLString }
//             },
//             resolve(parentValue,  {email, password }, req) {
//                 return AuthService.login({ email, password, req });
//             }
//         }
//     }

// });

// module.exports = mutation;