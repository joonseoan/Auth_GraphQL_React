import React from 'react';

import Header from './Header';

const App = ({children}) => {

    return(
        <div className="container">
            <Header />
            {/* children is from index.js which includes

                <Router history={hashHistory}>
                    <Route path="/" component={ App }>
                        <Route path="/login" component={ LoginForm } />
                        <Route path="/signup" component={ SignupForm } />
                    </Route>
                </Router>
            
            */}
            { children }
        </div>
    );
}

export default App;