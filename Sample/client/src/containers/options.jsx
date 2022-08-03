import React from 'react';
import Header from '../components/Header'
import Options from '../components/Options'

class OptionsPage extends React.Component {
	render() {
		const { login } = this.props.location.state
		return(
		<div>
			<Header login={login} />
			<Options login={login}/>
		</div>
		)
	}
}

export default OptionsPage;
