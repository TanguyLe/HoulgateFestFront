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
        timeLeft.sec = Math.round(diff);

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
        const countDown = this.state.timeLeft;
        const units = [
            [countDown.days, "jour", "jours"],
            [countDown.hours, "heure", "heures"],
            [countDown.min, "minute", "minutes"],
            [countDown.sec, "seconde", "secondes"],
        ];

        return (
            <div className="countdown" role="timer" aria-live="off">
                {units.map(([value, singular, plural]) => (
                    <div className="countdown__unit" key={plural}>
                        <span className="countdown__value">{this.addLeadingZeros(value)}</span>
                        <span className="countdown__label">{value === 1 ? singular : plural}</span>
                    </div>
                ))}
            </div>
        );
    }
}
