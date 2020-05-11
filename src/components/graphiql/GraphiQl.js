import React, { Component } from "react";
import GraphiQL from "graphiql";
import "graphiql/graphiql.css";
// Import custom changes to the GraphiQl CSS that improves the visability
// of the Types
import "./GraphiQl.css";
import { graphQLFetcher } from "../../utils/api";
import rubrikLogo from "../../images/rubrikLogo.svg";

class GraphiQl extends Component {
  render() {
    return (
      <GraphiQL
        fetcher={(graphQLParams) =>
          graphQLFetcher(
            graphQLParams,
            this.props.platform,
            this.props.nodeIp,
            this.props.username,
            this.props.password,
            this.props.apiToken,
            this.props.polarisDomain
          )
        }
      >
        <GraphiQL.Logo>
          <img src={rubrikLogo} width="40" align="middle" alt="Rubrik logo" />
        </GraphiQL.Logo>
      </GraphiQL>
    );
  }
}

export default GraphiQl;
