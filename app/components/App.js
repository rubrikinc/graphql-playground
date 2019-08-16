// Main app
import React from 'react';
import Modal from 'react-modal';
import GraphiQL from 'graphiql';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import rubrikLogo from './rubrik_logo.svg';
import axios from 'axios';
import https from 'https';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      loginRequired: true,
      ip: '',
      username: '',
      password: '',
      access_token: '',
      error: '',
      platform: '',
      buttonDisabled: '',
      loginButtonMessage: 'Login'
    };

    this.rubrikToken = this.rubrikToken.bind(this);
  }

  graphQLFetcher = graphQLParams => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'graphiql-app',
      authorization: 'Bearer ' + this.state.access_token
    };

    const error = {
      data: null,
      errors: [
        {
          message:
            'I couldn\'t communicate with the GraphQL server at the provided URL. Is it correct?'
        }
      ]
    };

    const requestHeaders = Object.assign({}, defaultHeaders);

    var rubrikGQLURL = '';
    if (this.state.platform === 'polaris') {
      var userProvidedIP = this.state.ip;
      var userProvidedIP = userProvidedIP.replace('.my.rubrik.com', '');
      var userProvidedIP = userProvidedIP.replace('https://', '');

      var rubrikGQLURL = 'https://' + userProvidedIP + '.my.rubrik.com/api/graphql';
      
    } else {
      var rubrikGQLURL = 'https://' + this.state.ip + '/api/internal/graphql';
    }
    console.log('Rubrik GQL URL Unformatted');
    console.log(rubrikGQLURL);

    const url = new URL(rubrikGQLURL);
    console.log('Formatted URL');
    console.log(url);

    const method = 'post';

    const requestOptions = {
      method,
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: requestHeaders,
      rejectUnauthorized: false // avoid problems with self-signed certs
    };

    const request =
      url.protocol === 'https:'
        ? httpsRequest(requestOptions)
        : httpRequest(requestOptions);

    return new Promise((resolve, reject) => {
      request.on('response', response => {
        const chunks = [];
        response.on('data', data => {
          chunks.push(Buffer.from(data));
        });
        response.on('end', end => {
          const data = Buffer.concat(chunks).toString();
          if (response.statusCode >= 400) {
            reject(data);
          } else {
            resolve(JSON.parse(data));
          }
        });
      });

      request.on('error', reject);

      request.end(JSON.stringify(graphQLParams));
    });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  async rubrikToken() {
    console.log(this.state);

    var rubrikURL = '';
    var config = '';
    var defaultHeaders = '';

    if (this.state.platform === 'polaris') {

      var userProvidedIP = this.state.ip;
      var userProvidedIP = userProvidedIP.replace('.my.rubrik.com', '');
      var userProvidedIP = userProvidedIP.replace('https://', '');

      var rubrikURL = 'https://' + userProvidedIP + '.my.rubrik.com/api/session';

      console.log(rubrikURL);
      var data = {
        username: this.state.username,
        password: this.state.password
      };

      var defaultHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
    } else {
      var rubrikURL = 'https://' + this.state.ip + '/api/internal/session';

      var data = {
        initParams: {}
      };

      var defaultHeaders = {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' + btoa(this.state.username + ':' + this.state.password)
      };
    }
    console.log('Config');
    console.log(JSON.stringify(config));
    console.log('Default Headers');
    console.log(defaultHeaders);
    console.log('URL');
    console.log(rubrikURL);
    console.log('Full State');
    console.log(this.state);

    try {
      const instance = axios.create({
        timeout: 15000,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      console.log('Making the API request.');
      const response = await instance({
        method: 'post',
        url: rubrikURL,
        data: data,
        headers: defaultHeaders
      });

      // const response = await instance.post(rubrikURL, config, defaultHeaders);
      console.log('Response sent');

      console.log('Post made');
      if (this.state.platform === 'polaris') {
        this.setState({
          access_token: response.data.access_token,
          loginRequired: false
        });
      } else {
        this.setState({
          access_token: response.data.session.token,
          loginRequired: false
        });
      }
    } catch (error) {
      console.log(error.message);

      if (error.response) {
        console.log(error);
        console.log(error.response);
        if (error.response.status === 401 || error.response.status === 422) {
          this.setState({
            error: 'Sorry, you entered an incorrect email or password.',
            password: '',
            buttonDisabled: 'false',
            loginButtonMessage: 'Login'
          });
        } else {
          this.setState({
            error: error.response.message,
            buttonDisabled: 'false',
            loginButtonMessage: 'Login'
          });
        }
      } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
        this.setState({
          error: 'Sorry, we were unable to connect to the provided Rubrik platform.',
          ip: '',
          buttonDisabled: 'false',
          loginButtonMessage: 'Login'
        });
        console.log(this.state);
      } else if (error.message.includes('connect ETIMEDOUT') || error.message.includes('timeout of 15000ms exceeded') ) {
        this.setState({
          error: 'Sorry, we were unable to connect to the provided Rubrik platform.',
          ip: '',
          buttonDisabled: 'false',
          loginButtonMessage: 'Login'
        });
        console.log(this.state);
      } else {
        this.setState({
          error: error.message,
          buttonDisabled: 'false',
          loginButtonMessage: 'Login'
        });
      }
    }
  }

  handleFormSubmit = event => {
    event.preventDefault();

    this.setState({
      buttonDisabled: 'disabled',
      loginButtonMessage: 'Attempting to Connect'
      });

    this.rubrikToken();
  };

  handlePlatformSubmit = event => {
    this.setState({
      platform: event.target.textContent.toLowerCase(),
      ip: '',
      username: '',
      password: '',
      error: ''
       });
  };

  handleSelectYourPlatform = () => {
    this.setState({ platform: '' });
  };

  render() {
    // Authentication has not been provided. Only show the form
    if (this.state.access_token === '') {
      if (this.state.platform === '') {
        return (
          <div className="container">
            <div className="modal-dialog">
              <Modal isOpen={this.state.loginRequired} className="modal-dialog">
                <div className="d-flex justify-content-center">
                  <img
                    src={rubrikLogo}
                    width="80"
                    align="middle"
                    style={{ 'margin-top': '100px' }} // No margin when form is showing
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <h3 className="text-secondary" align="middle">
                    Select your Platfrom
                  </h3>
                </div>
                <div className="row">
                  <div className="col">
                    <button
                      type="submit"
                      className="btn btn-info btn-block-platform btn-raised"
                      onClick={this.handlePlatformSubmit}
                    >
                      <h2>Polaris</h2>
                    </button>
                  </div>
                  <div className="col">
                    <button
                      type="submit"
                      className="btn btn-info btn-lg btn-block-platform btn-raised"
                      onClick={this.handlePlatformSubmit}
                    >
                      <h2>CDM</h2>
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <p className="text-danger" align="middle" />
                </div>
              </Modal>
            </div>
          </div>
        );
      } else {
        return (
          <div className="container">
            <div className="modal-dialog">
              <Modal isOpen={this.state.loginRequired} className="modal-dialog">
                <div className="d-flex justify-content-center">
                  <img src={rubrikLogo} width="80" align="middle" />
                </div>
                <div className="d-flex justify-content-center">
                  <h3 className="text-secondary" align="middle">
                    Login
                  </h3>
                </div>
                <div className="d-flex justify-content-center">
                  <p className="font-weight-bold" align="middle">
                    {this.state.error}
                  </p>
                </div>
                <form id="loginForm" onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <label
                      className="col-form-label-sm font-weight-light text-secondary"
                      htmlFor="ip"
                      style={this.state.ip ? {} : { display: 'none' }}
                    >
                      {this.state.platform === 'cdm'
                        ? 'CDM IP or FQDN'
                        : 'Polaris Domain'}
                    </label>

                    <input
                      className="form-control"
                      type="text"
                      value={this.state.ip}
                      name="ip"
                      placeholder={
                        this.state.platform === 'cdm'
                          ? 'CDM IP or FQDN'
                          : 'Polaris Domain'
                      }
                      onChange={this.onChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label
                      className="col-form-label-sm font-weight-light text-secondary"
                      htmlFor="username"
                      style={this.state.username ? {} : { display: 'none' }}
                    >
                      Username
                    </label>
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      value={this.state.username}
                      name="username"
                      placeholder="Username"
                      onChange={this.onChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label
                      className="col-form-label-sm font-weight-light text-secondary"
                      htmlFor="password"
                      style={this.state.password ? {} : { display: 'none' }}
                    >
                      Password
                    </label>
                    <input
                      className="form-control"
                      type="password"
                      value={this.state.password}
                      name="password"
                      placeholder="Password"
                      onChange={this.onChange}
                      required
                    />
                  </div>
                  <p />
                  <button
                    type="submit"
                    className={'btn btn-info btn-lg btn-block btn-raised ' + this.state.buttonDisabled}
                  >
                    {this.state.loginButtonMessage}
                  </button>
                </form>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-link text-secondary"
                    onClick={this.handleSelectYourPlatform}
                  >
                    Select your Platform
                  </button>
                </div>
              </Modal>
            </div>
          </div>
        );
      }
    } else if (this.state.access_token !== '') {
      console.log('GraphQL Loading');
      return (
        <div className="graphiql-wrapper">
          <GraphiQL
            fetcher={this.graphQLFetcher}
            ref={graphiql => (this.graphiql = graphiql)}
          >
            <GraphiQL.Logo>
              <img src={rubrikLogo} width="40" align="middle" />
            </GraphiQL.Logo>
          </GraphiQL>
        </div>
      );
    }

    return <p>There was an error loading the GraphQL Playground.</p>;
  }
}
