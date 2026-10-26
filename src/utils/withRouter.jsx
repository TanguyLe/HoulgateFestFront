import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// react-router dropped withRouter: class components still get history.push and location as props
const withRouter = (Component) => (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    return <Component {...props} history={{ push: navigate }} location={location} />;
};

export default withRouter;
