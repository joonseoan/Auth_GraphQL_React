import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { hashHistory } from 'react-router';

import AuthForm from './AuthForm';
import mutation from '../mutations/Login';
import currentUserQuery from '../queries/CurrentUser';
import CurrentUser from '../queries/CurrentUser';


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
    // should change to componentDidUpdate
    componentWillUpdate(nextProps) {
        if(!this.props.data.user && nextProps.data.user) {
            hashHistory.push('/dashboard')
        }
    }

}




// For the redirect
// Step 1: Associate Form for the fetching update.
export default graphql(CurrentUser)(
    graphql(mutation)(LoginForm)
);

// IMPORTANT ----------------------------------------------------------
/* 
    As experienced in mutation,
    even though we use promise and then, 
    redirect is fast enought so when we redirect the other routes,
    the refetched data won't reach out to the redirected React component.
    
    Most of time the render probably runs fast.
    All components will rerender whenever the (fetched) data is updated
    However, the render will not get updated data because the redirect and the reder
    will be faster than the fetched data is done. 
    Afterwards, the data wil arrived
    but the componnet will not able to render that data(In this case, the data is null).

    In order to resolve this issue, we will use lifecyle method.
    then(() -> { refetchQueries : [ query ]}) 
    then(() => { redirece('/)})



*/
