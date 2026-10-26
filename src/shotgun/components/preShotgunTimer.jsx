import React from "react";

const getSecondsLeft = (expiry) => Math.max(0, Math.ceil((expiry - Date.now()) / 1000));

// Time left before a pre-shotgun expires, the expiry being a timestamp on the client's clock
export default class PreShotgunTimer extends React.Component {
    constructor(props) {
        super(props);

        this.state = { secondsLeft: getSecondsLeft(props.expiry) };
    }

    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ secondsLeft: getSecondsLeft(this.props.expiry) }),
            1000,
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { secondsLeft } = this.state;

        if (secondsLeft === 0) return <small>Expiré</small>;

        const minutes = Math.floor(secondsLeft / 60);
        const seconds = String(secondsLeft % 60).padStart(2, "0");

        return (
            <small>
                {this.props.label} {minutes}:{seconds}
            </small>
        );
    }
}
