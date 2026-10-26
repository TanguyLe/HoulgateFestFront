import React from "react";

const TURNSTILE_SCRIPT_URL =
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileLoading = null;

// Loads the Cloudflare Turnstile script once, only on the pages showing a captcha
const loadTurnstile = () => {
    if (!turnstileLoading)
        turnstileLoading = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = TURNSTILE_SCRIPT_URL;
            script.async = true;
            script.onload = () => resolve(window.turnstile);
            script.onerror = () => {
                turnstileLoading = null;
                reject();
            };
            document.head.appendChild(script);
        });

    return turnstileLoading;
};

// Cloudflare Turnstile widget proving the user isn't a robot: calls onToken with the token the
// back checks, or with null once it expired. Tokens are single use, call reset() after each submission
class Captcha extends React.Component {
    constructor() {
        super();

        this.container = React.createRef();
        this.widgetId = null;
    }

    componentDidMount() {
        loadTurnstile()
            .then((turnstile) => {
                // the component may have been unmounted while the script loaded
                if (!this.container.current) return;

                this.widgetId = turnstile.render(this.container.current, {
                    sitekey: process.env.TURNSTILE_SITE_KEY,
                    language: "fr",
                    callback: (token) => this.props.onToken(token),
                    "expired-callback": () => this.props.onToken(null),
                    "error-callback": () => this.props.onToken(null),
                });
            })
            .catch(() => console.error("Could not load the captcha"));
    }

    componentWillUnmount() {
        if (this.widgetId !== null) window.turnstile.remove(this.widgetId);
    }

    reset() {
        this.props.onToken(null);
        if (this.widgetId !== null) window.turnstile.reset(this.widgetId);
    }

    render() {
        return <div ref={this.container} />;
    }
}

export default Captcha;
