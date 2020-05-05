import React, { Component } from "react";
import LandingPage from "./components/LandingPage";
import GraphiQl from "./components/GraphiQl";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      platform: null,
      nodeIp: null,
      username: null,
      password: null,
      apiToken: null,
      polarisDomain: null,
    };

    this.handleCredentialUpdate = this.handleCredentialUpdate.bind(this);
  }

  handleCredentialUpdate(
    platform,
    nodeIp,
    username,
    password,
    apiToken,
    polarisDomain
  ) {
    this.setState({
      platform,
      nodeIp,
      username,
      password,
      apiToken,
      polarisDomain,
    });
  }

  render() {
    if (this.state.apiToken == null) {
      return (
        <LandingPage
          credentialUpdate={(
            platform,
            nodeIp,
            username,
            password,
            apiToken,
            polarisDomain
          ) =>
            this.handleCredentialUpdate(
              platform,
              nodeIp,
              username,
              password,
              apiToken,
              polarisDomain
            )
          }
        />
      );
    } else {
      return (
        <GraphiQl
          platform={this.state.platform}
          nodeIp={this.state.nodeIp}
          username={this.state.username}
          password={this.state.password}
          apiToken={this.state.apiToken}
          polarisDomain={this.state.polarisDomain}
        />
      );
    }
  }
}

export default App;
