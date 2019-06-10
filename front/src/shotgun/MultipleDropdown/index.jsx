import React from "react";
import Gravatar from "react-gravatar";
import {Dropdown, Button, Form} from "semantic-ui-react";


class MultipleDropdown extends React.Component {
    constructor(props) {
        super();

        let availablePersonsIds = [];
        this.optionsPerUserId = {};

        props.availablePersons.map(person => {
            availablePersonsIds.push(person._id);

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
        });

        this.state = {
            beds: new Array(props.numberOfBeds).fill(''),
            availablePersonsIds: availablePersonsIds
        };

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

            this.setState({beds: beds, availablePersonsIds: persons});
        }
    }

    submit(event) {
        this.props.onSubmit(this.state.beds.slice(1, this.state.beds.length));
        event.preventDefault();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.availablePersons) !== JSON.stringify(this.props.availablePersons)) {
            const nextIds = nextProps.availablePersons.map(person => person._id);

            // Let's check the selected beds first

            const currentBeds = this.state.beds.map(e => {
                if ((e === '') || (!nextIds.includes(e)))
                    return '';

                return e;
            });

            // Then the available persons

            const currentAvailablePersonsIds = this.state.availablePersonsIds.filter(e => nextIds.includes(e));

            this.setState({beds: currentBeds, availablePersonsIds: currentAvailablePersonsIds});
        }
    }

    componentDidMount() {
        const currentUsername = window.localStorage.getItem("username");
        const currentUserId = Object.values(this.optionsPerUserId).find(person => person.text === currentUsername).key;

        this.handleChange("", 0, currentUserId);
    }

    render() {
        const regularOptions = this.state.availablePersonsIds.map(id => this.optionsPerUserId[id]);
        const generateDropdownOption = (username) => [...regularOptions, this.optionsPerUserId[username]];

        const submitDisabled = this.state.beds.indexOf('') !== -1;

        return (
            <Form>
                <Form.Group style={{flexWrap: "wrap"}}>
                    {[
                        ...[...new Array(this.props.numberOfBeds).keys()].map(bedIndex => {
                                const userId = this.state.beds[bedIndex];
                                const options = userId === '' ? regularOptions : generateDropdownOption(userId);

                                return (
                                    <Form.Field key={`bed_${bedIndex}`}>
                                        <Dropdown
                                            upward
                                            placeholder={`emplacement n°${bedIndex + 1}`}
                                            selection
                                            disabled={bedIndex === 0}
                                            search
                                            onChange={(event, {value}) => this.handleChange(event, bedIndex, value)}
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
                        </Button>
                    ]}
                </Form.Group>
            </Form>
        );
    }
}

export default MultipleDropdown;
