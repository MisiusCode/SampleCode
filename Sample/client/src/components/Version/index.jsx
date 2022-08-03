import './index.css';
import React from 'react';
import { version } from  '../../../package.json'

class Version extends React.Component {
    render() {
        return (
            <div id='footer'>
                <h4>{`Versija: ${version}`}</h4>
            </div>
        )
    }
}

export default Version;
