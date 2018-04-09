import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Accounts from '../components/Accounts';
import { getWeb3Async } from '../util/web3';

storiesOf('Accounts', module).add('Details', () => <LoadWeb3Wrapper />);

//This wrapper is required due to the current inability of the add method above to handle promises or async/await functions
//https://github.com/storybooks/storybook/issues/713
class LoadWeb3Wrapper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {web3: undefined}
	}

    async componentDidMount() {
		getWeb3Async().then((web3) => this.setState({ web3: web3 }));
	}

	render() {
		return(
			<div>{this.state.web3 && <Accounts web3={this.state.web3}/>}</div>
		);
	}
}