import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';

import App from './components/App';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

const networkInterface = createNetworkInterface({
  uri: '/graphql', // same route app.use('graphql', {}) in index.js
  // the client is sending the request with cookie in the browser.
  // Then, the server compares that cookie data to the cookie data in database.
  // Finally, do root query about the current user and then send current user's data (req.user)
  opts: {
    // sending cookie information every time the client requess~~*******
    credentials: 'same-origin'
  }
});

const client = new ApolloClient({

  networkInterface,

  // ******** every record pulled out of the server/database,
  //  is stored, in a cache of apolloclient, as a Object type with a field "id" 

  // We need to define graphql id type in the server like the followings.
  /* 

    const UserType = new GraphQLObjectType({
        name: 'UserType',
        fields: {
            id: { type: GraphQLID }, // it is stord in graphql cheche memory automatically****************
            email: { type: GraphQLString }
        }

    });
    // Hence, we can define and fetch id value as an object field from apollo client's cache 
  
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
            <Route path="/dashboard" component={ Dashboard } />
          </Route>
      </Router>

    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));
