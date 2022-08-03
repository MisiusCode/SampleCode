import React from 'react';
import Login from '../components/Login'
import Version from '../components/Version';

class LoginPage extends React.Component {
    render() {
        return (
            <div>
                <Login/>
                <Version/>
            </div>
        )
    }
}

export default LoginPage
