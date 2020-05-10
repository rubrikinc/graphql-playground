import axios from "axios";
import https from "https";
import { request as httpsRequest } from "https";

const defaultHttpHeader = {
  "Content-Type": "application/json",
  "User-Agent": "RubrikGraphQLPlayground",
};

function formatIp(ip) {
  /*
   * This function will processes the user provide CDM IP or Polaris Domain
   * and removes any values that will prevent connection to the platforms.
   */

  return ip
    .replace("https://", "")
    .replace(".my.rubrik.com", "")
    .replace("/", "");
}

export function userFiendlyErrorMessage(error, usingCdmApiToken) {
  /*
   * This function will processes an error mesage returned by an API call
   * and then provide a user friendly version of that error message
   */
  if (error.response) {
    if (error.response.status === 401 || error.response.status === 422) {
      if (usingCdmApiToken === true) {
        return "Sorry, you entered an incorrect API token.";
      } else {
        return "Sorry, you entered an incorrect email or password.";
      }
    } else if (error.response.status === 400 || error.response.status === 401) {
      return "Sorry, the request was rejected as malformed by the Rubrik platform.";
    } else {
      return `Sorry, the request was rejected with a ${error.response.status} (${error.response.data.message}) HTTP response status code.`;
    }
  } else if (
    error.message.includes("getaddrinfo ENOTFOUND") ||
    error.message.includes("Network Error")
  ) {
    return "Sorry, we were unable to connect to the provided Rubrik platform.";
  } else if (
    error.message.includes("connect ETIMEDOUT") ||
    error.message.includes("timeout of 15000ms exceeded")
  ) {
    return "Sorry, the connection to the Rubrik platform timeout and we were unable to connect.";
  } else {
    return error.message;
  }
}

async function rubrikApiPost(url, httpHeaders, body) {
  /*
   * This function will make an HTTP Post using the supplied endpoint and
   * httpHeaders.
   */

  const instance = axios.create({
    timeout: 15000,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
  const response = await instance({
    method: "post",
    url: url,
    headers: httpHeaders,
    data: body,
  });

  return response;
}

async function rubrikApiGet(url, httpHeaders) {
  /*
   * This function will make an HTTP Post using the supplied endpoint and
   * httpHeaders.
   */

  const instance = axios.create({
    timeout: 15000,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
  const response = await instance({
    method: "get",
    url: url,
    headers: httpHeaders,
  });
  return response;
}

export async function validateCredentials(
  platform,
  nodeIp,
  username,
  password,
  cdmApiToken,
  usingCdmApiToken,
  polarisDomain
) {
  /*
   * This function makes an API request to CDM to validate the supplied
   * credentials. Since we use Basic authentication to make GQL calls to CDM,
   * which prevent token timeouts issues, we don't actually use the returned
   * API Token.
   */
  let httpHeader = defaultHttpHeader;
  var endpoint;
  var postBody;
  if (platform === "cdm") {
    if (usingCdmApiToken) {
      httpHeader.Authorization = "Bearer " + cdmApiToken;
    } else {
      httpHeader.Authorization = "Basic " + btoa(username + ":" + password);
    }
    endpoint = "/api/v1/cluster/me/version";
    postBody = {};
  } else {
    httpHeader.Accept = "application/json, text/plain";
    httpHeader["Content-Type"] = "application/json;charset=UTF-8";
    endpoint = `${polarisDomain}/api/session`;
    postBody = {
      username: username,
      password: password,
    };
  }
  const formattedNodeIp = formatIp(nodeIp);

  let url = `https://${formattedNodeIp}${endpoint}`;

  let response;
  if (platform === "cdm") {
    response = await rubrikApiGet(url, httpHeader);
    return response.data.version;
  } else {
    response = await rubrikApiPost(url, httpHeader, postBody);
    return response.data.access_token;
  }
}

export function graphQLFetcher(
  graphQLParams,
  platform,
  nodeIp,
  username,
  password,
  apiToken,
  polarisDomain
) {
  /*
   * This function is used by GraphiQl to make the GraphQL API calls.
   */
  const formattedNodeIp = formatIp(nodeIp);
  let httpHeader = defaultHttpHeader;
  let endpointPrefix = `https://${formattedNodeIp}`;
  let endpointSuffixPolaris = `${polarisDomain}/api/graphql`;
  let endpointSuffixCdm = "/api/internal/graphql";

  var endpoint;
  if (platform === "polaris") {
    httpHeader.Authorization = `Bearer ${apiToken}`;
    endpoint = endpointPrefix + endpointSuffixPolaris;
  } else {
    if (password === null) {
      httpHeader.Authorization = "Bearer " + apiToken;
    } else {
      httpHeader.Authorization = "Basic " + btoa(username + ":" + password);
    }
    endpoint = endpointPrefix + endpointSuffixCdm;
  }

  // TODO: Update to use rubrikApiPost
  const url = new URL(endpoint);

  const requestOptions = {
    method: "post",
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    headers: httpHeader,
    rejectUnauthorized: false, // avoid problems with self-signed certs
  };

  const request = httpsRequest(requestOptions);

  return new Promise((resolve, reject) => {
    request.on("response", (response) => {
      const chunks = [];
      response.on("data", (data) => {
        chunks.push(Buffer.from(data));
      });
      response.on("end", (end) => {
        const data = Buffer.concat(chunks).toString();
        if (response.statusCode >= 400) {
          reject(JSON.parse(data));
        } else {
          resolve(JSON.parse(data));
        }
      });
    });

    request.on("error", reject);

    request.end(JSON.stringify(graphQLParams));
  });
}
