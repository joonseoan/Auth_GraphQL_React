import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import AuthForm from './AuthForm';
import mutation from '../mutations/Login';
import currentUserQuery from '../queries/CurrentUser';


class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = { errors: [] };
    }

    // callback
    onSubmit({ email, password }) {
        this.props.mutate({
            variables: { email, password },
            refetchQueries: [{ query: currentUserQuery }]
        
        // { debugger } ; finding the spot where we put "debugger" in bundle.js of sources in the browser
        // Then type : res.graphQLErrors[0].message => it will find the error message
        // }).catch(res => { debugger });

        // return multiple errors
        }).catch( res => { 
            
            const errors = res.graphQLErrors.map(error => error.message);

            // ***********************
            // Extrely important
            // (1) Like the one below, we can define this.setState({}) at callback function
            //      which is invoked by event and submit function.

            // (2) Therefore, also, onClick = { () => { function() {
            //      this.setState() // it is ok as well.
            // }}}
            this.setState({ errors });
            console.log('this.state.errors: ', this.state.errors)
                
        });

    }

    render() {
        return(
            <div>
                <h3>Login</h3>
                <AuthForm 
                    onSubmit={ this.onSubmit.bind(this) } 
                    errors={ this.state.errors }
                />
            </div>
        );
    }
}

export default graphql(mutation)(LoginForm);
