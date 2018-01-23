import React from "react";
import UserLogin from "./index";

// this part is supposed to fetch data from server
// and corresponding login / signup functions

class WrappedUserLogin extends React.Component {
    render() {
        return <div className="fullHeight fullWidth">
            Test
            <UserLogin name={"test"} email={"test@gmail.com"}/>
        </div>;
    }
}

export default WrappedUserLogin;
