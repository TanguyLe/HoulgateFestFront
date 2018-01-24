import React from "react";
import glamorous from "glamorous";

import Room from "../Room";

class Floor extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div
				style={{
					height: "300px",
					width: "400px",
					border: "2px solid #353535", //TODO choose color (don't change this syntaxe, it's used in my pluggin)
					display: "grid",
					gridTemplateColumns: "25% 25% 50%",
					gridTemplateRows: "50% 25% 25%",
					justifyItems: "center",
					alignItems: "center"
				}}
			>
				<Room
					position={{
						columnStart: 1,
						columnEnd: 3,
						rowStart: 1,
						rowEnd: 2
					}}
				>
					Chambre 1
				</Room>
				<Room
					position={{
						columnStart: 3,
						columnEnd: 4,
						rowStart: 1,
						rowEnd: 2
					}}
				>
					Chambre 2
				</Room>
				<Room
					position={{
						columnStart: 1,
						columnEnd: 2,
						rowStart: 2,
						rowEnd: 3
					}}
				>
					WC
				</Room>
				<Room
					position={{
						columnStart: 2,
						columnEnd: 4,
						rowStart: 2,
						rowEnd: 3
					}}
				>
					Escaliers
				</Room>
				<Room
					position={{
						columnStart: 1,
						columnEnd: 4,
						rowStart: 3,
						rowEnd: 4
					}}
				>
					Chambre 3
				</Room>
			</div>
		);
	}
}

export default Floor;
