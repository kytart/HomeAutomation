import * as React from 'react';
import ModeType from '../../common/Mode';
import { getCurrentMode, setMode } from '../api';

interface IState {
	currentMode?: ModeType,
	pendingUpdate: boolean;
	interval?: any;
}

export default class Mode extends React.PureComponent<{}, IState> {

	public state: IState = {
		pendingUpdate: false,
	};

	public async componentDidMount() {
		const currentMode = await getCurrentMode();
		const interval = setInterval(() => this.refreshMode(), 10e3);
		this.setState({ currentMode, interval });
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
					<h3>Change Mode</h3>
					<button
						className="btn btn-danger"
						onClick={() => this.setMode(ModeType.DAY)}
						disabled={this.state.pendingUpdate || this.state.currentMode === ModeType.DAY}
					>Day</button>
					<button
						className="btn btn-primary"
						onClick={() => this.setMode(ModeType.NIGHT)}
						disabled={this.state.pendingUpdate || this.state.currentMode === ModeType.NIGHT}
					>Night</button>
				</div>
			</div>
		);
	}

	private async refreshMode() {
		const currentMode = await getCurrentMode();
		this.setState({ currentMode });
	}

	private async setMode(mode: ModeType) {
		this.setState({
			pendingUpdate: true,
		});
		try {
			await setMode(mode);
			this.setState({
				currentMode: mode,
			});
		} finally {
			this.setState({
				pendingUpdate: false,
			});
		}

	}
}
