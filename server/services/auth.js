const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('user');

//------------------------- Session management by Object _id----------------------------------

// Simply 'id' (tokenized) is compared to id in mongo
// If they are same, the authentication is granted.

// serializeUser for session
// SerializeUser is used to provide some identifying token that can be saved
// in the users session. We traditionally use the 'ID' for this.
passport.serializeUser((user, done) => {
  // user is from the first login after signup. Please, find function signup below.
  // Therefore, user is from mongodb that just saved the new user
  //  in that eventually it uses id of document
  console.log('Where "user" is from?: ', user); 
  // 'id' is ObjectID from mongoDB.
  // _id value is returned when save() in signup. Then, when the user automatically loggs in again,
  // the id is returned to be serialized.
  done(null, user.id);

});

// deserializeUser for mongo db
// The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// the user object.  This object is placed on ***************'req.user'****************.
passport.deserializeUser((id, done) => {
  console.log('id at deserializeUser', id)
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Instructs Passport how to authenticate a user using a locally saved email
// and password combination.  ******* This strategy is called whenever a user attempts to
// log in.  We first find the user model in MongoDB that matches the submitted email,
// then check to see if the provided password matches the saved password. 


// There *********************************
// are two obvious failure points here: the email might not exist in our DB or
// the password might not match the saved one.  In either case, we call the 'done'
// callback, including a string that messages why the authentication process failed.
// This string is provided back to the GraphQL client.
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {

    console.log('user at LocalStrategy', user);

    if (err) { return done(err); }
    if (!user) { return done(null, false, 'Invalid Credentials'); }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }

      console.log('isMatch at LocalStrategy: ', isMatch);

      if (isMatch) {
        console.log('user at comparePassword in LocalStrategy: ', user);
        return done(null, user);
      }
      return done(null, false, 'Invalid credentials.');
    });
  });
}));

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!
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

        // req.login can be used because
        // app.use(passport.initialize()); in server.js file
        req.logIn(user, (err) => {
          // If error occurs, stop here
          if (err) { reject(err); }
          // After login, return uers
          resolve(user);
        });
        
      });

    });
}

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.

/*
  Authenticate
  Authenticating requests is as simple as calling passport.authenticate() 
  and specifying which strategy to employ. authenticate()'s function signature
  is standard Connect middleware, 
  which makes it convenient to use as route middleware in Express applications.

  (Strategy is a local here)!

  app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect('/users/' + req.user.username);
    });

  By default, if authentication fails, Passport will respond with a 401 Unauthorized status, 
  and any additional route handlers will not be invoked. 
  If authentication succeeds, the next handler will be invoked and the req.user property will be 
  set to the authenticated user.

Note: Strategies must be configured prior to using them in a route. Continue reading the chapter on configuration for details.

*/

// It can be replaced with express (/login);
// custom callback of passport.authenticate() : (err, user => {})(req, res, next)
//    At this function, req only is used. res and next are null.
function login({ email, password, req }) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (!user) { reject('Invalid credentials.') }

      req.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
}

module.exports = { signup, login };
