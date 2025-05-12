import React from "react";

const TripPage = () => {
    return (
        <div>
            <iframe
                style={{ border: "none", width: "412px", height: "172px" }}
                src={process.env.TOGETZER_IFRAME_URL}
            ></iframe>
        </div>
    );
};

export default TripPage;
