import * as React from "react";
import CurrentTemperature from './CurrentTemperature';
import Mode from './Mode';
import DesiredTemperatures from './DesiredTemperatures';

export default () => (
	<div className="container">
		<h1 id="mainTitle">Home Automation</h1>
		<CurrentTemperature/>
		<Mode/>
		<DesiredTemperatures/>
	</div>
);
