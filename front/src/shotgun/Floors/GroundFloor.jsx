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
					gridTemplateColumns: "12% 18.5% 6% 30% 33.5%",
					gridTemplateRows: "19% 20% 18% 43%",
					justifyItems: "stretch",
					alignItems: "center",
					justifyContent: "start",
					alignContent: "start"
				}}
			>
				<Room
					position={{
						columnStart: 2,
						columnEnd: 3,
						rowStart: 2,
						rowEnd: 3
					}}
				>
					Escalier
				</Room>
                <Room
                    position={{
                        columnStart: 3,
                        columnEnd: 4,
                        rowStart: 2,
                        rowEnd: 3
                    }}
                >
                    W.C
				</Room>
                <Room
                    position={{
                        columnStart: 4,
                        columnEnd: 5,
                        rowStart: 1,
                        rowEnd: 2
                    }}
                >
                    Salle de Bain
				</Room>
                <Room
                    position={{
                        columnStart: 2,
                        columnEnd: 4,
                        rowStart: 3,
                        rowEnd: 4
                    }}
                >
                    Couloir
				</Room>
				<Room
					position={{
						columnStart: 4,
						columnEnd: 6,
						rowStart: 2,
						rowEnd: 4
					}}
				>
					Cuisine
				</Room>
                <Room
                    position={{
                        columnStart: 1,
                        columnEnd: 5,
                        rowStart: 4,
                        rowEnd: 5
                    }}
                >
                    Salle à manger
                </Room>
                <Room
                    position={{
                        columnStart: 5,
                        columnEnd: 6,
                        rowStart: 4,
                        rowEnd: 5
                    }}
                >
                    Petit Salon
                </Room>
			</div>
		);
	}
}

export default Floor;
