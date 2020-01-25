import * as React from 'react';
import { getDesiredTemperature, setDesiredTemperature } from '../api';
import Mode from '../../common/Mode';

export interface IProps {
	id: string;
	label: string;
	mode: Mode;
}

interface IState {
	currentValue?: number;
	pendingUpdate: boolean;
}

export default class DesiredTemperature extends React.PureComponent<IProps, IState> {

	public state: IState = {
		pendingUpdate: false,
	};

	public async componentDidMount() {
		const currentValue = await getDesiredTemperature(this.props.mode);
		this.setState({ currentValue });
	}

	public render() {
		const elementId = 'desiredTemperature_' + this.props.id;
		return (
			<div className="form-group">
				<label htmlFor={elementId}>{this.props.label}: {this.state.currentValue}°C</label>
				<input
					type="range"
					className="form-control-range"
					id={elementId}
					disabled={this.state.pendingUpdate}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.onChange(event)}
					min={0}
					max={30}
					step={1}
					value={this.state.currentValue}
				/>
			</div>
		);
	}

	private async onChange(event: React.ChangeEvent<HTMLInputElement>) {
		const newValue = event.target.valueAsNumber;
		this.setState({
			pendingUpdate: true,
		});
		try {
			await setDesiredTemperature(this.props.mode, newValue);
			this.setState({
				currentValue: newValue,
			});
		} finally {
			this.setState({
				pendingUpdate: false,
			});
		}
	}
}
