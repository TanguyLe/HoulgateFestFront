import React from "react";
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
        event.preventDefault();
        if (this.state.beds.indexOf("") === -1)
            this.props.onSubmit(this.state.beds.slice(1, this.state.beds.length));
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
            nextIds.includes(e),
        );

        return { beds: currentBeds, availablePersonsIds: currentAvailablePersonsIds };
    }

    componentDidMount() {
        const currentUsername = this.state.username;
        const currentUserId = Object.values(this.optionsPerUserId).find(
            (person) => person.text === currentUsername,
        ).key;

        this.handleChange("", 0, currentUserId);
        register(this.onLoginChange);
    }
    componentWillUnmount() {
        unregister(this.onLoginChange);
    }

    render() {
        const regularOptions = this.state.availablePersonsIds.map(
            (id) => this.optionsPerUserId[id],
        );
        const missing = this.state.beds.filter((bed) => bed === "").length;

        return (
            <form className="beds" onSubmit={this.submit}>
                <ol className="beds__list">
                    {[...new Array(this.props.numberOfBeds).keys()].map((bedIndex) => {
                        const userId = this.state.beds[bedIndex];
                        const options =
                            userId === ""
                                ? regularOptions
                                : [this.optionsPerUserId[userId], ...regularOptions];

                        return (
                            <li key={`bed_${bedIndex}`} className="beds__row">
                                <span className="beds__index">{bedIndex + 1}</span>
                                {bedIndex === 0 ? (
                                    <span className="beds__me">
                                        {this.state.username} <small>(toi)</small>
                                    </span>
                                ) : (
                                    <select
                                        className="field__control"
                                        aria-label={`Emplacement n°${bedIndex + 1}`}
                                        value={userId}
                                        onChange={(event) =>
                                            this.handleChange(event, bedIndex, event.target.value)
                                        }
                                    >
                                        <option value="" disabled>
                                            Choisis un·e camarade…
                                        </option>
                                        {options
                                            .slice()
                                            .sort((a, b) => a.text.localeCompare(b.text))
                                            .map((option) => (
                                                <option key={option.key} value={option.value}>
                                                    {option.text}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </li>
                        );
                    })}
                </ol>
                <button
                    type="submit"
                    className="btn btn--success btn--lg btn--block"
                    disabled={missing > 0}
                >
                    {missing > 0
                        ? `Encore ${missing} lit${missing > 1 ? "s" : ""} à attribuer`
                        : "Confirmer la chambre"}
                </button>
            </form>
        );
    }
}

export default BedsMultipleDropdown;
