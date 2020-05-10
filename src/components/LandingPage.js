import React, { Component } from "react";
// App Component related imports
import "./LandingPage.css";
import rubrikLogo from "../images/rubrikLogo.svg";
import LoginForm from "./LoginForm";
import { validateCredentials, userFiendlyErrorMessage } from "../utils/api";
// Material-UI related imports
import CodeIcon from "@material-ui/icons/Code";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const selectYourPlatformFormHeader = "Select your Platform";
const loginButtonText = "Login";
const connectingToPlatformButtonText = "Attempting to Connect";
const polarisUserDomain = ".my.rubrik.com";
const polarisDevDomain = ".dev.my.rubrik-lab.com";

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formHeader: selectYourPlatformFormHeader,
      platform: null,
      loginButtonText: loginButtonText,
      loginErrorMessage: null,
      apiToken: null,
      ip: null,
      username: null,
      password: null,
      cdmApiToken: null,
      polarisDomain: polarisUserDomain,
      usingCdmApiToken: false,
    };

    this.createLoginForm = this.createLoginForm.bind(this);
    this.handleSwitchToLogin = this.handleSwitchToLogin.bind(this);
    this.handleSelectYourPlatform = this.handleSelectYourPlatform.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.handleLoginButton = this.handleLoginButton.bind(this);
    this.createLoginHeader = this.createLoginHeader.bind(this);
    this.createDevModeIcon = this.createDevModeIcon.bind(this);
    this.handleModeButton = this.handleModeButton.bind(this);
  }

  handleSwitchToLogin(event) {
    event.preventDefault();

    this.setState({
      platform: event.target.textContent.toLowerCase(),
      formHeader: loginButtonText,
    });
  }

  async handleLoginButton(event) {
    event.preventDefault();
    this.setState({
      loginButtonText: connectingToPlatformButtonText,
      loginErrorMessage: null,
    });

    try {
      let apiToken = await validateCredentials(
        this.state.platform,
        this.state.ip,
        this.state.username,
        this.state.password,
        this.state.cdmApiToken,
        this.state.usingCdmApiToken,
        this.state.polarisDomain
      );

      this.setState({
        apiToken: this.state.cdmApiToken ? this.state.cdmApiToken : apiToken,
        loginButtonText: "Login",
      });

      // If using API Token Authentication for CDM connectivity, reset the username
      // and password to null in case they were also filled out in the login form
      if (this.state.usingCdmApiToken) {
        this.setState({
          username: null,
          password: null,
        });
      }

      this.props.credentialUpdate(
        this.state.platform,
        this.state.ip,
        this.state.username,
        this.state.password,
        this.state.apiToken,
        this.state.polarisDomain
      );
    } catch (error) {
      this.setState({
        loginErrorMessage: userFiendlyErrorMessage(
          error,
          this.state.usingCdmApiToken
        ),
        loginButtonText: loginButtonText,
      });
    }
  }

  handleSelectYourPlatform(event, platform) {
    this.setState({
      platform: this.state.platform === "polaris" ? "cdm" : "polaris",
      loginErrorMessage: null,
      usingCdmApiToken: false,
    });
  }

  handleModeButton() {
    this.setState({
      polarisDomain:
        this.state.polarisDomain === polarisUserDomain
          ? polarisDevDomain
          : polarisUserDomain,
    });
  }

  onFormChange(event) {
    // This function handles the input from the form fields and sets the
    // appropriate state.

    if (event.target.id !== "useApiTokenCheckBox") {
      this.setState({ [event.target.id]: event.target.value });
    } else {
      this.setState({
        usingCdmApiToken: event.target.checked,
      });
    }
  }

  createFullLandingPageUi() {
    return (
      <React.Fragment>
        <div className="landing-page">
          {this.createWelcome()}

          {this.createLogin()}
        </div>
      </React.Fragment>
    );
  }

  // Creates the "Welcome to the Rubrik GraphQL Playground" UI
  createWelcome() {
    return (
      <div className="welcome-message">
        <div></div>
        <div className="center-white-text">
          <div className="larger-font-size">
            <span>Welcome to the </span>
            <span className="bold-text">
              <span>Rubrik GraphQL Playground</span>
            </span>
          </div>
        </div>
        <div className="bottom-white-small-text">
          <span className="thin-text">
            <span>Don't Backup. </span>
          </span>
          <span>Go Forward.</span>
        </div>
      </div>
    );
  }

  // Creates the right side of the Welcome screen where the login form lives
  createLogin() {
    return (
      <div className="login">
        <div className="flex-container">
          <div className="flex-row">
            {this.createLoginLogo()}
            {this.createLoginHeader()}
            {this.state.platform === null && this.createLoginPlatformButtons()}
            {this.state.platform != null && this.createLoginForm()}
            {this.createRwpLink()}
            {this.createDevModeIcon()}
          </div>
        </div>
      </div>
    );
  }

  createLoginLogo() {
    return (
      <div className="display-flex-justify">
        <img alt="Rubrik logo" src={rubrikLogo} width="80" />
      </div>
    );
  }

  createLoginHeader() {
    return (
      <React.Fragment>
        <div className="login-text display-flex-justify">
          {this.state.formHeader}
        </div>
        {this.state.platform != null && this.createLoginErrorMessage()}
      </React.Fragment>
    );
  }

  createLoginErrorMessage() {
    return (
      <div className="error-text display-flex-justify">
        {this.state.loginErrorMessage}
      </div>
    );
  }

  createLoginPlatformButtons() {
    return (
      <div className="btn-row {this.state.platform}">
        <div className="btn-column">
          <button
            type="submit"
            className="primary-button"
            onClick={this.handleSwitchToLogin}
          >
            <h3>Polaris</h3>
          </button>
        </div>
        <div className="btn-column">
          <button
            type="submit"
            className="primary-button"
            onClick={this.handleSwitchToLogin}
          >
            <h3>CDM</h3>
          </button>
        </div>
      </div>
    );
  }

  createRwpLink() {
    // TODO: If you try to download the link when you don't have internet access the app goes blank
    // Until error handling is in place for this, we are are just going to return null
    // return (
    //   <div className="display-flex-justify">
    //     <a href="https://www.rubrik.com/content/dam/rubrik/en/resources/white-paper/an-introduction-to-graphql-and-rubrik.pdf">
    //       An Introduction to GraphQL and Rubrik Whitepaper
    //     </a>
    //   </div>
    // );
    return;
  }

  createDevModeIcon() {
    const HtmlTooltip = withStyles((theme) => ({
      tooltip: {
        backgroundColor: "rgb(255, 255, 255)",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        "text-align": "center",
      },
    }))(Tooltip);

    if (this.state.platform === "polaris") {
      return (
        <div className="bottom-right">
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit" variant="body2">
                  {this.state.polarisDomain === polarisUserDomain
                    ? "Set the Polaris Domain to development. Internal Rubrik use only."
                    : "Set the Polaris Domain to production."}
                </Typography>
              </React.Fragment>
            }
          >
            <IconButton aria-label="delete" onClick={this.handleModeButton}>
              {this.state.polarisDomain === polarisUserDomain ? (
                <PersonIcon />
              ) : (
                <CodeIcon />
              )}
            </IconButton>
          </HtmlTooltip>
        </div>
      );
    } else {
      return;
    }
  }

  createLoginForm() {
    return (
      <LoginForm
        platform={this.state.platform}
        ip={this.state.ip}
        username={this.state.username}
        password={this.state.password}
        cdmApiToken={this.state.cdmApiToken}
        usingCdmApiToken={this.state.usingCdmApiToken}
        selectYourPlatform={this.handleSelectYourPlatform}
        onFormChange={this.onFormChange}
        loginButton={this.handleLoginButton}
        loginButtonText={this.state.loginButtonText}
        polarisDomain={this.state.polarisDomain}
      />
    );
  }

  render() {
    return this.createFullLandingPageUi();
  }
}

export default LandingPage;
