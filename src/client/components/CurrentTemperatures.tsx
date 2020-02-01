import * as React from 'react';
import CurrentTemperature from './CurrentTemperature';
import rooms from '../../common/rooms';

export default class CurrentTemperatures extends React.PureComponent {

	public render() {
		return (
			<div className="row">
				<div className="col-sm">
					<h3>Current Temperature</h3>
					{rooms.map((room: { key: string, label: string }) => (
						<CurrentTemperature room={room.key} label={room.label}/>
					))}
				</div>
			</div>
		);
	}
}
