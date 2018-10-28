import React from "react";
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

import {Dropdown, Button, Form} from "semantic-ui-react";
import Gravatar from "react-gravatar";

class MultipleDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            beds: Array(props.numberOfBeds).fill(''),
            availablePersonsIds: []
        };

        this.optionsPerUserId = {};


        map(person => {
            this.state.availablePersonsIds.push(person._id);
            this.optionsPerUserId[person._id] = {
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

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange(event, updatedBedIndex, value) {
        const oldSelection = this.state.beds[updatedBedIndex];

        if (oldSelection !== value) {
            let beds = this.state.beds.slice();
            let persons = this.state.availablePersonsIds.slice();

            beds[updatedBedIndex] = value;

            persons.splice(persons.indexOf(value), 1);

            if (oldSelection !== '')
                persons.push(oldSelection);

            this.setState(Object.assign(this.state, {beds: beds, availablePersonsIds: persons}));
        }
    }

    submit(event) {
        this.props.onSubmit(this.state.beds.slice(1, this.state.beds.length));
        event.preventDefault();
    }

    componentDidMount() {
        const currentUserId = get("key",
            find(
                person => person.text === window.localStorage.getItem("username"),
                this.optionsPerUserId
            ));

        this.handleChange("", 0, currentUserId);
    }

    render() {
        const generateDropdownOption = (listIds) => map(id => this.optionsPerUserId[id], listIds);
        const submitDisabled = this.state.beds.indexOf('') !== -1;

        return (
            <Form>
                <Form.Group style={{flexWrap: "wrap"}}>
                    {[
                        ...map(bedIndex => {
                                const username = this.state.beds[bedIndex];
                                const options = username === '' ? generateDropdownOption(this.state.availablePersonsIds) :
                                                generateDropdownOption(this.state.availablePersonsIds.concat([username]));

                                return (
                                    <Form.Field key={`bed_${bedIndex}`}>
                                        <Dropdown
                                            upward
                                            placeholder={`emplacement n°${bedIndex + 1}`}
                                            selection
                                            disabled={bedIndex === 0}
                                            search
                                            onChange={(event, {value}) =>
                                                this.handleChange(event, bedIndex, value)
                                            }
                                            value={username}
                                            options={options}
                                        />
                                    </Form.Field>
                                );
                        }, range(0, this.props.numberOfBeds)),
                        <Button
                            key={"validationButton"}
                            disabled={submitDisabled}
                            color={submitDisabled === true ? null : "green"}
                            onClick={this.submit}
                        >
                            Confirmer
                        </Button>
                        // </div>
                    ]}
                </Form.Group>
            </Form>
        );
    }
}

export default MultipleDropdown;
