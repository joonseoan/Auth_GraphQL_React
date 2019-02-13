import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';

import App from './components/App';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

// the client is sending the request with cookie in the browser.
// Then, the server compares it cookies to client's cookie information
// Finally, do root query about the current user and then send current user's data (req.user)
const networkInterface = createNetworkInterface({
  uri: '/graphql', // same route app.use('graphql', {}) in index.js
  opts: {
    credentials: 'same-origin'
  }
});

const client = new ApolloClient({

  networkInterface,
  // every record pulled out of the server/database,
  //  is stored as a type of id in a cache of apolloclient

  // We need to define graphql id type in the server like the followings.
  /* 

    const UserType = new GraphQLObjectType({

        // UserType here for Object field name inside of GraphQLObject
        // like this.name = UserType in GraphQLObject
        name: 'UserType',
        fields: {
            id: { type: GraphQLID },
            email: { type: GraphQLString }
        }

    });
  
  */ 
  dataIdFromObject: o => o.id
});

const Root = () => {
  return (

    <ApolloProvider client={client}>
    
      <Router history={hashHistory}>
          <Route path="/" component={ App }>
            <Route path="/login" component={ LoginForm } />
            <Route path="/signup" component={ SignupForm } />
          </Route>
      </Router>

    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));
