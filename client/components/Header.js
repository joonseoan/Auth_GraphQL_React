import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';

import queryCurrentUser from '../queries/CurrentUser';
import mutation from '../mutations/Logout';

class Header extends Component {

    onLogoutClick(){

        this.props.mutate({
            // rerun the query to get login sign in the navbar
            // By the way, we can put different queries inside of the array below.
            
            // returns in the network of the browser 
            /* 
                {data: {user: null}}
                    data: {user: null}
                    user: null
            
            */

            // then, signup and log marks shows up in the nav bar.
            refetchQueries: [{ query: queryCurrentUser }] 
        });

    }

    renderButton() {
        
        const { loading, user } = this.props.data;
        
        if(loading) return <div />;

        if(user) {
            return (<li>
                        <a onClick={this.onLogoutClick.bind(this)}>
                            Logout
                        </a>
            </li>);

        } else {
            return(
                <div>
                   <li>
                        <Link to="/signup">Signup</Link> 
                   </li>
                   <li>
                        <Link to="/login">Login</Link>
                   </li>
                </div>
            );
        }

    }

    render() {

        console.log(this.props.data);
        
        return(

           <nav>
                <div className="nav-wrapper">
                    <Link to="/" className="brand-logo left">Home</Link>
                    <ul className="right">
                        { this.renderButton() }
                    </ul>
                </div>
           </nav>

        );
    }
}

export default graphql(mutation)(

    graphql(queryCurrentUser)(Header)

);