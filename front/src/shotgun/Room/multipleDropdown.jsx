import React from "react";
import glamorous from "glamorous";
import { map, range, clone, filter, includes } from "lodash/fp";
const mapUncapped = map.convert({ cap: false });
import { Dropdown, Button } from "semantic-ui-react";
import Gravatar from "react-gravatar";

class MultipleDropdown extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			beds: []
		};

		map(i => {
			this.state.beds[i] = {};
			this.state.beds[i]["selected"] = "";
			this.state.beds[i][
				"personAvailable"
			] = this.props.availablePersonIds;
		}, range(0, this.props.numberOfBeds));

		this.handleChange = this.handleChange.bind(this);
		this.submit = this.submit.bind(this);
	}

	handleChange(event, i, value) {
		const oldBeds = this.state.beds;
		const previousSelection = this.state.beds[i].selected;
		const newSelection = value;

		let newBeds;
		if (newSelection !== previousSelection) {
			newBeds = mapUncapped((bed, index) => {
				if (index !== i) {
					return {
						selected: bed.selected,
						personAvailable:
							previousSelection !== ""
								? [
										...filter(
											person => newSelection !== person,
											bed.personAvailable
										),
										previousSelection
									]
								: filter(
										person => newSelection !== person,
										bed.personAvailable
									)
					};
				} else {
					return {
						selected: newSelection,
						personAvailable: bed.personAvailable
					};
				}
			}, oldBeds);
			this.setState({ beds: newBeds });
		}
	}

	submit(event) {
		alert("selected :" + map(bed => bed.selected, this.state.beds));
		event.preventDefault();
	}
	render() {
		const generateDropdownOption = person => ({
			key: person,
			value: person,
			text: person,
			image: (
				<Gravatar
					email={`${person}@houlgatefest.com`}
					rating="pg"
					default="retro"
				/>
			)
		});

		const submitDisabled = includes(
			"",
			map(bed => bed.selected, this.state.beds)
		);

		return (
			<div
				style={{
					maxWidth: 300,
					margin: "auto"
				}}
			>
				<link
					rel="stylesheet"
					href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
				/>
				<div>
					{map(
						i => (
							<Dropdown
								placeholder={`bed n°${i + 1}`}
								fluid
								selection
								search
								onChange={(event, { value }) =>
									this.handleChange(event, i, value)
								}
								value={this.state.beds[i].selected}
								options={map(
									generateDropdownOption,
									this.state.beds[i].personAvailable
								)}
							/>
						),
						range(0, this.props.numberOfBeds)
					)}
				</div>
				<div style={{ margin: "auto", display: "flex" }}>
					<Button
						disabled={submitDisabled}
						color={submitDisabled ? false : "green"}
						style={{ margin: "auto" }}
						onClick={this.submit}
					>
						Validate
					</Button>
				</div>
			</div>
		);
	}
}

export default MultipleDropdown;
