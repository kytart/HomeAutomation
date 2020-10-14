import * as React from 'react';
import { getCurrentTemperature, TemperatureRecord } from '../api';

interface IProps {
	room: string;
	label: string;
}

interface IState {
	temperature?: TemperatureRecord | null;
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
			const temperature = this.state.temperature;
			return (
				<p>
					{this.props.label}:{' '}
					{temperature
						? [
							<span>{temperature.temperature}</span>,
							' ',
							<span className="tempRecordedAt">({temperature.recordedAt.toLocaleString()})</span>,
						] : 'never'
					}
				</p>
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