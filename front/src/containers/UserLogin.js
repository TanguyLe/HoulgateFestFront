import React, { Component } from "react";
import UserLogin from "../components/UserLogin";

// this part is supposed to fetch data from server
// and corresponding login / signup functions

class WrappedUserLogin extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return;
    <div className="fullHeight fullWidth">
      AAAAA
      <UserLogin name={"test"} email={"test@gmail.com"} />
    </div>;
  }
}

export default WrappedUserLogin;
