import * as React from "react";
import CurrentTemperatures from './CurrentTemperatures';
import Mode from './Mode';
import DesiredTemperatures from './DesiredTemperatures';

export default () => (
	<div className="container">
		<h1 id="mainTitle">Home Automation</h1>
		<CurrentTemperatures/>
		<Mode/>
		<DesiredTemperatures/>
	</div>
);
