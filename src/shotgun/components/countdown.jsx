import React from "react";

export default class Countdown extends React.Component {
    constructor(props) {
        super(props);

        // We store the target date and the current date and compute the current date ourselves not to rely on the
        // client's date. The currentDatetime from the upper component is actually a correctDate from an API
        this.state = {
            currentDatetime: props.currentDatetime,
            timeLeft: Countdown.calculateCountdown(props.targetDatetime, props.currentDatetime),
        };
    }

    componentDidMount() {
        // update every second
        this.interval = setInterval(() => {
            let nextCurrentDatetime = new Date(this.state.currentDatetime);
            nextCurrentDatetime.setSeconds(nextCurrentDatetime.getSeconds() + 1);
            const timeLeft = Countdown.calculateCountdown(
                this.props.targetDatetime,
                nextCurrentDatetime,
            );
            timeLeft
                ? this.setState({
                      currentDatetime: nextCurrentDatetime,
                      timeLeft: timeLeft,
                  })
                : this.stop();
        }, 1000);
    }

    componentWillUnmount() {
        this.stop();
    }

    static calculateCountdown(targetDatetime, currentDatetime) {
        let diff = (targetDatetime - currentDatetime) / 1000;

        // clear countdown when date is reached
        if (diff <= 0) return false;

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        };

        if (diff >= 365.25 * 86400) {
            // 365.25 * 24 * 60 * 60
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) {
            // 24 * 60 * 60
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) {
            // 60 * 60
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        // floor, not round: "60 secondes" is not a thing
        timeLeft.sec = Math.floor(diff);

        return timeLeft;
    }

    stop() {
        clearInterval(this.interval);
        if (this.props.onTime) this.props.onTime();
    }

    addLeadingZeros(value) {
        value = String(value);

        while (value.length < 2) {
            value = "0" + value;
        }

        return value;
    }

    render() {
        const countDown = this.state.timeLeft || { days: 0, hours: 0, min: 0, sec: 0 };
        const units = [
            [countDown.days, "Jour", "Jours"],
            [countDown.hours, "Heure", "Heures"],
            [countDown.min, "Minute", "Minutes"],
            [countDown.sec, "Seconde", "Secondes"],
        ];
        const label = units
            .slice(0, 3)
            .map(([value, one, many]) => value + " " + (value === 1 ? one : many).toLowerCase())
            .join(", ");

        return (
            <div
                className={
                    "Countdown countdown" +
                    (this.props.size ? " countdown--" + this.props.size : "")
                }
                role="timer"
                aria-label={label}
            >
                {units.map(([value, one, many]) => (
                    <span className="countdown__cell" key={many} aria-hidden="true">
                        <strong className="countdown__value">{this.addLeadingZeros(value)}</strong>
                        <span className="countdown__unit">{value === 1 ? one : many}</span>
                    </span>
                ))}
            </div>
        );
    }
}
