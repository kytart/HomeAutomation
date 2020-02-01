import * as React from 'react';
import { getCurrentTemperature } from '../api';

interface IProps {
	room: string;
	label: string;
}

interface IState {
	temperature?: number;
	interval?: any;
}

export default class CurrentTemperature extends React.PureComponent<IProps, IState> {

	public state: IState = {};

	public async componentDidMount() {
		const temperature = await getCurrentTemperature(this.props.room);
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
		if (typeof this.state.temperature !== 'undefined') {
			return (
				<p>{this.props.label}: {this.state.temperature}°C</p>
			);
		} else {
			return null;
		}
	}

	private async refreshTemperature() {
		const temperature = await getCurrentTemperature(this.props.room);
		this.setState({ temperature });
	}
}