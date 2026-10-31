import React from "react";

import Captcha from "./captcha";
import { Icon } from "../ui";

// The Turnstile captcha under the last field of a form, with the error the back gave for it
const CaptchaField = React.forwardRef(({ onToken, error }, ref) => (
    <div className="captcha-field">
        <Captcha ref={ref} onToken={onToken} />
        {error && (
            <p className="md-field__supporting captcha-field__error body-small" role="alert">
                <Icon name="error" className="md-field__error-icon" />
                {error}
            </p>
        )}
    </div>
));

export default CaptchaField;
