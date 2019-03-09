import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { hashHistory } from 'react-router';

import AuthForm from './AuthForm';
import query from '../queries/CurrentUser';
import mutation from '../mutations/Signup';

class SignupForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: []
        };
    
    }
    onSubmit({email, password}) {
        this.props.mutate({
            variables: { email, password },
            refetchQueries: [ { query }]
        })
        .catch(res => {
            const errors = res.graphQLErrors.map(error => error.message);
            this.setState({ errors });
        });

    }

    render() {

        console.log(this.state.errors)
        return(
            <div>
                <h3>Sign Up</h3>
                <AuthForm 
                    onSubmit={ this.onSubmit.bind(this) }
                    errors={ this.state.errors }
                />
            </div>
        );
    }

    // should change to componentDidUpdate
    componentWillUpdate(nextProps) {
        if(!this.props.data.user && nextProps.data.user) {
            hashHistory.push('/dashboard')
        }
    }
}

export default graphql(query)(
    graphql(mutation)(SignupForm)
);