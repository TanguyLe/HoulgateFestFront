import React from "react";

import Floor from "./index";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX } from "../../constants";

let getHeight = () => (window.innerWidth < 640 ? "auto" : "calc(100vh - 150px)");

class DisplayAllFloors extends React.Component {
    constructor() {
        super();

        this.state = {
            height: getHeight(),
        };

        this.onResize = this.onResize.bind(this);
    }

    onResize() {
        let target_height = getHeight();

        if (target_height !== this.state.height) {
            this.setState({ height: target_height });
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    render() {
        return (
            <div className="allFloors" style={{ height: this.state.height }}>
                {this.props.floors.map((floor, index) => {
                    return (
                        <Floor
                            key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index}
                            floorData={floor}
                            userInfo={this.props.userInfo}
                            createShotgunFunction={(event, room) =>
                                this.props.createShotgunFunction(event, room, floor)
                            }
                            addPersonsInShotgunFunction={this.props.addPersonsInShotgunFunction}
                            cancelShotgunFunction={this.props.cancelShotgunFunction}
                        />
                    );
                })}
            </div>
        );
    }
}

export default DisplayAllFloors;
