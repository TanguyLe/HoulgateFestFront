/* @flow */
import React from "react";
import glamorous from "glamorous";
import { isNil } from "lodash/fp";

import Button from "../../utils/basics/Button/index";
import Block from "../../utils/basics/Block/index";
import Text from "../../utils/basics/Text/index";
import TextBlock from "../../utils/basics/TextBlock/index";
import Wrapper from "../../utils/basics/Wrapper/index";

class WhoAmI extends React.Component {
		render() {
		let ContentToDisplay;
		if (isNil(this.props.name) || isNil(this.props.email)) {
			ContentToDisplay = () => (
				<Wrapper column>
					<Block>
						<Block padding={"small"} align={"left"}>
							<Text weight={"bold"}>T Pa Loggé Gros </Text>
						</Block>
						<Block padding={"small"} align={"left"}>
							<Text>Moi j'aime bien les abricots</Text>
						</Block>
					</Block>
				</Wrapper>
			);
		} else {
			ContentToDisplay = () => (
				<Wrapper column>
					<Block>
						<Block padding={"small"} align={"left"}>
							<Text weight={"bold"}>Name: </Text>
							<Text>{this.props.name}</Text>
						</Block>
						<Block padding={"small"} align={"left"}>
							<Text weight={"bold"}>Mail: </Text>
							<Text>{this.props.email}</Text>
						</Block>
					</Block>
				</Wrapper>
			);
		}

		return <ContentToDisplay />;
	}
}

export default WhoAmI;
