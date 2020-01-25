import * as React from "react";
import Mode from '../../common/Mode';
import DesiredTemperature from './DesiredTemperature';

export default () => (
	<div className="row">
		<div className="col-sm">
			<h3>Change Temperature Preset</h3>
			<DesiredTemperature id="day" label="Day" mode={Mode.DAY}/>
			<DesiredTemperature id="night" label="Night" mode={Mode.NIGHT}/>
		</div>
	</div>
);
