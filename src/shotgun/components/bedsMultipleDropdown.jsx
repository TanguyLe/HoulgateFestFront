import React from "react";
import { Dropdown, Button, Form } from "semantic-ui-react";
import { getCredentials, register, unregister } from "../../login/store";

class BedsMultipleDropdown extends React.Component {
    constructor(props) {
        super();

        let availablePersonsIds = [];
        this.optionsPerUserId = {};

        props.availablePersons.map((person) => {
            availablePersonsIds.push(person._id);

            this.optionsPerUserId[person._id] = {
                key: person._id,
                value: person._id,
                text: person.username,
            };
        });

        this.state = {
            beds: new Array(props.numberOfBeds).fill(""),
            availablePersonsIds: availablePersonsIds,
            username: getCredentials().login,
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.onLoginChange = this.onLoginChange.bind(this);
    }
    onLoginChange(newCreds) {
        this.setState({ username: newCreds.login });
    }

    handleChange(event, updatedBedIndex, value) {
        const oldSelection = this.state.beds[updatedBedIndex];

        if (oldSelection !== value) {
            let beds = this.state.beds.slice();
            let persons = this.state.availablePersonsIds.slice();

            beds[updatedBedIndex] = value;

            persons.splice(persons.indexOf(value), 1);

            if (oldSelection !== "") persons.push(oldSelection);

            this.setState({ beds: beds, availablePersonsIds: persons });
        }
    }

    submit(event) {
        this.props.onSubmit(this.state.beds.slice(1, this.state.beds.length));
        event.preventDefault();
    }

    static getDerivedStateFromProps(props, state) {
        const nextIds = props.availablePersons.map((person) => person._id);

        // Let's check the selected beds first

        const currentBeds = state.beds.map((e) => {
            if (e === "" || !nextIds.includes(e)) return "";

            return e;
        });

        // Then the available persons

        const currentAvailablePersonsIds = state.availablePersonsIds.filter((e) =>
            nextIds.includes(e)
        );

        return { beds: currentBeds, availablePersonsIds: currentAvailablePersonsIds };
    }

    componentDidMount() {
        const currentUsername = this.state.username;
        const currentUserId = Object.values(this.optionsPerUserId).find(
            (person) => person.text === currentUsername
        ).key;

        this.handleChange("", 0, currentUserId);
        register(this.onLoginChange);
    }
    componentWillUnmount() {
        unregister(this.onLoginChange);
    }

    render() {
        const regularOptions = this.state.availablePersonsIds.map(
            (id) => this.optionsPerUserId[id]
        );
        const generateDropdownOption = (username) => [
            ...regularOptions,
            this.optionsPerUserId[username],
        ];

        const submitDisabled = this.state.beds.indexOf("") !== -1;

        return (
            <Form>
                <Form.Group style={{ flexWrap: "wrap" }}>
                    {[
                        ...[...new Array(this.props.numberOfBeds).keys()].map((bedIndex) => {
                            const userId = this.state.beds[bedIndex];
                            const options =
                                userId === "" ? regularOptions : generateDropdownOption(userId);

                            return (
                                <Form.Field key={`bed_${bedIndex}`}>
                                    <Dropdown
                                        upward
                                        placeholder={`emplacement n°${bedIndex + 1}`}
                                        selection
                                        disabled={bedIndex === 0}
                                        search
                                        onChange={(event, { value }) =>
                                            this.handleChange(event, bedIndex, value)
                                        }
                                        value={userId}
                                        options={options}
                                    />
                                </Form.Field>
                            );
                        }),
                        <Button
                            key={"validationButton"}
                            disabled={submitDisabled}
                            color={submitDisabled === true ? null : "green"}
                            onClick={this.submit}
                        >
                            Confirmer
                        </Button>,
                    ]}
                </Form.Group>
            </Form>
        );
    }
}

export default BedsMultipleDropdown;
