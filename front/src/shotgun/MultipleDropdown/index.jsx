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
			beds: [],
			personsImages: [],
			listOfIds: [],
			optionsPerUserId: {}
		};

		map(person => {
			this.state.listOfIds.push(person.id);
			this.state.optionsPerUserId[person.id] = {
				key: person.id,
				value: person.id,
				text: person.username,
				image: (
					<Gravatar
						email={`${person.username}@houlgatefest.com`}
						rating="pg"
						default="retro"
					/>
				)
			};
		}, props.availablePersonIds);

		map(bedIndex => {
			this.state.beds[bedIndex] = {};
			this.state.beds[bedIndex]["selected"] = "";
			this.state.beds[bedIndex][
				"availablePersons"
			] = this.state.listOfIds;
		}, range(0, props.numberOfBeds));

		this.handleChange = this.handleChange.bind(this);
		this.submit = this.submit.bind(this);
	}

	handleChange(event, updatedBedIndex, value) {
		const oldBeds = this.state.beds;
		const oldSelection = this.state.beds[updatedBedIndex].selected;
		const newSelection = value;

		function updateBed(bed, index) {
			let selected;
			let availablePersons;

			if (index !== updatedBedIndex) {
				// it means the current bed isn't the one we updated
				// we dont need to change the bed.selected value
				// However, we need to remove the newly selected person
				// from the list of available persons. And we also need to add
				// the previously selected person back as avaible.

				selected = bed.selected;
				if (oldSelection !== "") {
					// We take the previous list available persons without
					// the newly selected person. And we set the previously
					// selected person as available.
					availablePersons = [
						...filter(
							person => newSelection !== person,
							bed.availablePersons
						),
						oldSelection
					];
				} else {
					// We take the previous list available persons without
					// the newly selected person. But we don't set the
					// previously selected person as available because it was
					// the default value.
					availablePersons = filter(
						person => newSelection !== person,
						bed.availablePersons
					);
				}
			} else {
				// this bed is the one to update :
				// we only change the selected person
				selected = newSelection;
				availablePersons = bed.availablePersons;
			}

			//we return the new state of the bed
			return {
				selected: selected,
				availablePersons: availablePersons
			};
		}

		let newBeds;
		if (newSelection !== oldSelection) {
			// only update if there is a change
			newBeds = mapUncapped(updateBed, oldBeds);
			this.setState({ beds: newBeds });
		}
	}

	submit(event) {
		alert("selected :" + map(bed => bed.selected, this.state.beds));
		event.preventDefault();
	}
	render() {
		/**
		 * Format a list of persons to match Semantic-UI-Dropdown entries
		 * (it's a curried function, lodash/fp's map is autocurried)
		 */
		const generateDropdownOption = map(
			id => this.state.optionsPerUserId[id]
		);

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
				{/* this import is only for dev, this has to be done higher */}
				<link
					rel="stylesheet"
					href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
				/>
				<div>
					{map(
						bedIndex => (
							console.log(
								this.state.beds[bedIndex].availablePersons,
								generateDropdownOption(
									this.state.beds[bedIndex].availablePersons
								)
							),
							(
								<Dropdown
									key={`bed_${bedIndex}`}
									placeholder={`emplacement n°${bedIndex +
										1}`}
									fluid
									selection
									search
									onChange={(event, { value }) =>
										this.handleChange(
											event,
											bedIndex,
											value
										)
									}
									value={this.state.beds[bedIndex].selected}
									options={generateDropdownOption(
										this.state.beds[bedIndex]
											.availablePersons
									)}
								/>
							)
						),
						range(0, this.props.numberOfBeds)
					)}
				</div>
				<div style={{ margin: "auto", display: "flex" }}>
					<Button
						disabled={submitDisabled}
						color={submitDisabled === true ? null : "green"}
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
