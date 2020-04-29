import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import InputAdornment from "@material-ui/core/InputAdornment";
import "../components/LandingPage.css";

const useStylesForm = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
    },
  },
}));

const useStylesSlectPlatformButton = makeStyles((theme) => ({
  root: {
    "& > *": {
      backgroundColor: "#FFF",
      "&:hover": {
        backgroundColor: "#FFF",
      },
      width: "100%",
      textTransform: "none",
      "font-weight": 100,
      "font-size": " 1.0775rem",
    },
  },
}));

const useStylesLoginButton = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
      "&:hover": {
        "background-color": "#18b8e9",
        "border-color": "#18b8e9",
      },
      "border-radius": "0.286rem",
      "line-height": " 1.83",
      color: "#fff",
      "background-color": "rgb(0, 134, 192)",
      "border-color": "rgb(0, 134, 192)",
      display: "inline-block",
      "margin-top": "20px",
      "font-weight": 200,
      "font-size": "1.0775rem",
      "text-transform": "uppercase",
      "box-shadow":
        "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
    },
  },
}));

export default function LoginForm(props) {
  const classesForm = useStylesForm();
  const classesSelectPlatformButton = useStylesSlectPlatformButton();
  const classesLoginButton = useStylesLoginButton();

  function diableLoginButton() {
    // This function controls whether or not the field button is disabled.
    // The logic is super ugly and can be cleaned up but it works
    if (
      props.ip === null ||
      props.username === null ||
      props.password === null
    ) {
      return true;
    }
    if (props.ip !== null) {
      if (props.ip.length <= 0) {
        return true;
      }
    }

    if (props.username !== null) {
      if (props.username.length <= 0) {
        return true;
      }
    }

    if (props.password !== null) {
      if (props.password.length <= 0) {
        return true;
      }
    }

    if (props.loginButtonText !== "Login") {
      return true;
    }
  }

  return (
    <form
      className={classesForm.root}
      onSubmit={(event) => props.loginButton(event)}
      autoComplete="off"
    >
      <div>
        <TextField
          autoFocus
          error={props.ip !== null && props.ip === ""}
          required
          id="ip"
          label={props.platform === "cdm" ? "CDM IP or FQDN" : "Polaris Domain"}
          onChange={props.onChange}
          InputProps={
            props.platform === "cdm"
              ? null
              : {
                  endAdornment: (
                    <InputAdornment position="end">
                      {props.polarisDomain}
                    </InputAdornment>
                  ),
                }
          }
        />
        <TextField
          required
          id="username"
          label="Username"
          onChange={props.onChange}
          error={props.username !== null && props.username === ""}
        />

        <TextField
          required
          id="password"
          label="Password"
          type="password"
          onChange={props.onChange}
          error={props.password !== null && props.password === ""}
        />
      </div>
      <div className={classesLoginButton.root}>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={diableLoginButton()}
        >
          {props.loginButtonText}
        </Button>
      </div>
      <div className={classesSelectPlatformButton.root}>
        <Button onClick={props.selectYourPlatform}>
          {props.platform === "cdm" ? "Switch to Polaris" : "Switch to CDM"}
        </Button>
      </div>
    </form>
  );
}
