import * as React from 'react';
import { getCurrentTemperature } from '../api';

interface IState {
	temperature?: number;
	interval?: any;
}

export default class CurrentTemperature extends React.PureComponent<{}, IState> {

	public state: IState = {};

	public async componentDidMount() {
		const temperature = await getCurrentTemperature();
		const interval = setInterval(() => this.refreshTemperature(), 10e3);
		this.setState({
			temperature,
			interval,
		});
	}

	public componentWillUnmount() {
		if (typeof this.state.interval !== 'undefined') {
			clearInterval(this.state.interval);
		}
	}

	public render() {
		return (
			<div className="row">
				<div className="col-sm">
					<h3>Current Temperature</h3>
					{typeof this.state.temperature !== 'undefined' && (
						<p>Bedroom: {this.state.temperature}°C</p>
					)}
				</div>
			</div>
		);
	}

	private async refreshTemperature() {
		const temperature = await getCurrentTemperature();
		this.setState({ temperature });
	}
}
