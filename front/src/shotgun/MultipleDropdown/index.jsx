import React from "react";
import glamorous from "glamorous";
import {
    map,
    range,
    clone,
    filter,
    includes,
    get,
    find,
    slice
} from "lodash/fp";

const mapUncapped = map.convert({cap: false});
import {Dropdown, Button, Form} from "semantic-ui-react";
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
            this.state.listOfIds.push(person._id);
            this.state.optionsPerUserId[person._id] = {
                key: person._id,
                value: person._id,
                text: person.username,
                image: (
                    <Gravatar
                        email={`${person.username}@houlgatefest.com`}
                        rating="pg"
                        default="retro"
                    />
                )
            };
        }, props.availablePersonsIds);

        map(bedIndex => {
            this.state.beds[bedIndex] = {};
            this.state.beds[bedIndex].selected = "";
            this.state.beds[bedIndex]["availablePersons"] = this.state.listOfIds;
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
                        ...filter(person => newSelection !== person, bed.availablePersons),
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
            this.setState({beds: newBeds});
        }
    }

    submit(event) {
        console.log(
            slice(
                1,
                this.state.beds.length,
                map(bed => bed.selected, this.state.beds)
            )
        );

        this.props.onSubmit(
            slice(
                1,
                this.state.beds.length,
                map(bed => bed.selected, this.state.beds)
            )
        );
        event.preventDefault();
    }

    componentDidMount() {
        this.handleChange(
            "",
            0,
            get(
                "_id",
                find(
                    person => person.username === window.localStorage.getItem("username"),
                    this.props.availablePersonsIds
                )
            )
        );
    }

    render() {
        /**
         * Format a list of persons to match Semantic-UI-Dropdown entries
         * (it's a curried function, lodash/fp's map is autocurried)
         */
        const generateDropdownOption = map(id => this.state.optionsPerUserId[id]);

        const submitDisabled = includes(
            "",
            map(bed => bed.selected, this.state.beds)
        );

        return (
            <Form>
                <Form.Group style={{flexWrap: "wrap"}}>
                    {[
                        ...map(bedIndex => {
                            if (bedIndex === 0) {
                                return (
                                    <Form.Field key={`bed_${bedIndex}`}>
                                        <Dropdown
                                            upward
                                            placeholder={`emplacement n°${bedIndex + 1}`}
                                            selection
                                            disabled
                                            //onChange={(event, { value }) => this.handleChange(event, bedIndex, value)}
                                            value={this.state.beds[bedIndex].selected}
                                            options={generateDropdownOption(
                                                this.state.beds[bedIndex].availablePersons
                                            )}
                                        />
                                    </Form.Field>
                                );
                            } else {
                                return (
                                    <Form.Field key={`bed_${bedIndex}`}>
                                        <Dropdown
                                            upward
                                            placeholder={`emplacement n°${bedIndex + 1}`}
                                            selection
                                            search
                                            onChange={(event, {value}) =>
                                                this.handleChange(event, bedIndex, value)
                                            }
                                            value={this.state.beds[bedIndex].selected}
                                            options={generateDropdownOption(
                                                this.state.beds[bedIndex].availablePersons
                                            )}
                                        />
                                    </Form.Field>
                                );
                            }
                        }, range(0, this.props.numberOfBeds)),
                        <Button
                            key={"validationButton"}
                            disabled={submitDisabled}
                            color={submitDisabled === true ? null : "green"}
                            onClick={this.submit}
                        >
                            Validate
                        </Button>
                        // </div>
                    ]}
                </Form.Group>
            </Form>
        );
    }
}

export default MultipleDropdown;
