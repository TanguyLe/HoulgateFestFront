import React from "react";


export default class Countdown extends React.Component {
    constructor(props) {
        super(props);

        // We store the target date and the current date and compute the current date ourselves not to rely on the
        // client's date. The actualDate from the upper component is actually a correctDate from an API
        this.currentDatetime = Date.parse(props.timezoneLocalizedActualDatetime);
        this.targetDatetime = Date.parse(props.targetDatetime);

        this.state = this.calculateCountdown();
    }

    componentDidMount() {
        // update every second
        this.interval = setInterval(() => {
            this.currentDatetime += 1000;
            const date = this.calculateCountdown();
            date ? this.setState(date) : this.stop();
        }, 1000);
    }

    componentWillUnmount() {
        this.stop();
    }

    calculateCountdown() {
        let diff = (this.targetDatetime - this.currentDatetime) / 1000;

        // clear countdown when date is reached
        if (diff <= 0) return false;

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0
        };

        // calculate time difference between now and expected date
        if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) { // 24 * 60 * 60
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) { // 60 * 60
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
        if (this.props.onTime)
            this.props.onTime();
    }

    addLeadingZeros(value) {
        value = String(value);

        while (value.length < 2) {
            value = '0' + value;
        }

        return value;
    }

    render() {
        const countDown = this.state;

        return (
            <div className="Countdown">
				<span className="CountdownCol">
				  <span className="CountdownColElement">
					<strong>{this.addLeadingZeros(countDown.days)}</strong>
					<span>{countDown.days === 1 ? "Jour" : 'Jours'}</span>
				  </span>
				</span>

                <span className="CountdownCol">
				  <span className="CountdownColElement">
					<strong>{this.addLeadingZeros(countDown.hours)}</strong>
					<span>Heures</span>
				  </span>
				</span>


                <span className="CountdownCol">
				  <span className="CountdownColElement">
					<strong>{this.addLeadingZeros(countDown.min)}</strong>
					<span>Minutes</span>
				  </span>
				</span>

                <span className="CountdownCol">
				  <span className="CountdownColElement">
					<strong>{this.addLeadingZeros(countDown.sec)}</strong>
					<span>Secondes</span>
				  </span>
				</span>
            </div>
        );
    }
}
