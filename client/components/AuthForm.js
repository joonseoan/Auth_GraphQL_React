import React, { Component } from 'react';

class AuthForm extends Component {

    constructor(props) {
        super(props);

        this.state = { email: '', password:''};
    }

    // it is from form tag of this class
    onSubmit(e) {

        // const { email, password } = this.state;

        e.preventDefault();
        
        // it is from a parent class, LoginForm
        // this.props.onSubmit({ email, password });

        this.props.onSubmit(this.state);

        this.setState({ email: '', password:'' });

    }

    render() {
        return(
            <div className="row">
                <form className="col s4" onSubmit={ this.onSubmit.bind(this) }>
                    <div className="input-field">
                        <input 
                            type="text"
                            value={ this.state.email } 
                            onChange={ e => { this.setState({ email: e.target.value });} }
                            placeholder="Email"
                        />
                    </div>
                    <div className="input-field">
                        <input 
                            type="password"
                            value={ this.state.password }
                            onChange={ e => { this.setState({ password: e.target.value });} }
                            placeholder="Password"
                        />
                    </div>
                    <div className="errors">

                        {/* Error : Array object  */}
                        { this.props.errors.map(error => <div key = { error }>{ error }</div>)}
                    </div>
                    <button className="btn" type="submit">Submit</button>
                </form>
            </div>
        );
    }    

}

export default AuthForm;