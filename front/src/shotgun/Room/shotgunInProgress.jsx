import React from "react";
import glamorous from "glamorous";
import { map, range, clone, filter } from "lodash/fp";
const mapUncapped = map.convert({ cap: false });

class ShotgunInProgress extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			beds: []
		};

		map(i => {
			this.state.beds[i] = {};
			this.state.beds[i]["selected"] = "Select";
			this.state.beds[i][
				"personAvailable"
			] = this.props.availablePersonIds;
		}, range(0, this.props.numberOfBeds));

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event, i) {
		const oldBeds = this.state.beds;
		const previousSelection = this.state.beds[i].selected;

		const newSelection = event.target.value;

		let newBeds;
		if (newSelection !== null && newSelection !== undefined) {
			newBeds = mapUncapped((bed, index) => {
				if (index !== i) {
					return {
						selected: bed.selected,
						personAvailable:
							previousSelection !== "Select"
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
		}
		this.setState({ beds: newBeds });
	}

	handleSubmit(event) {
		alert("selected :" + map(bed => bed.selected, this.state.beds));
		event.preventDefault();
	}
	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					{map(
						i => (
							<label key={"LABEL_" + i}>
								lit n°{i + 1}:
								<select
									value={this.state.beds[i].selected}
									onChange={event =>
										this.handleChange(event, i)
									}
								>
									<option value={"Select"}>Select</option>
									{map(
										person => (
											<option
												key={
													"PERSON_" +
													person +
													"_OF_LABEL_" +
													i
												}
												value={person}
											>
												{person}
											</option>
										),
										this.state.beds[i].personAvailable
									)}
								</select>
							</label>
						),
						range(0, this.props.numberOfBeds)
					)}
					<input type="submit" value="valider" />
				</form>
			</div>
		);
	}
}

export default ShotgunInProgress;
