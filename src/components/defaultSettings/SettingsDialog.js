import React from "react";
import { withStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import SettingsIcon from "@material-ui/icons/Settings";

import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";

import CdmApiTokenToggle from "./CdmApiTokenToggle";
import PolarisDevelopmentModeToggle from "./PolarisDevelopmentModeToggle";
import DefaultPlatformSelection from "./DefaultPlatformSelection";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0086C0",
    },
  },
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  colorstrip: {
    "border-top": "solid 6px #0086C0",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle
      disableTypography
      className={(classes.root, classes.colorstrip)}
      {...other}
    >
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const storage = window.localStorage;

export default function SettingsDialog(props) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [cdmApiToken, setCdmApiTokenState] = React.useState(false);
  const [polarisDevMode, setPolarisDevModeState] = React.useState(false);
  const [defaultPlatform, setDefaultPlatform] = React.useState("none");

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleSaveSettings = (event) => {
    event.preventDefault();
    console.log("");
    console.log("Saving Settings....");

    storage.setItem("platform", defaultPlatform);
    storage.setItem("cdmApiToken", cdmApiToken);
    storage.setItem("polarisDevMode", polarisDevMode);
    console.log("Polaris Dev Mode");
    console.log(storage.getItem("polarisDevMode"));

    props.handleDefaultUpdate(defaultPlatform, cdmApiToken, polarisDevMode);
    setSettingsOpen(false);
  };

  const settingsIcon = () => {
    return (
      <div className="top-right">
        <IconButton aria-label="delete" onClick={handleSettingsOpen}>
          <SettingsIcon />
        </IconButton>
      </div>
    );
  };

  // TODO: Combine the toggle handles into a single function
  const handleCdmApiTokenState = (state) => {
    setCdmApiTokenState(state);
  };

  const handlePolarisDevModeState = (state) => {
    setPolarisDevModeState(state);
  };

  const handleDefaultPlatform = (platform) => {
    setDefaultPlatform(platform);
  };

  const settingsDialog = () => {
    return (
      <React.Fragment>
        {settingsIcon()}
        <Dialog
          onClose={(event) => handleSettingsClose(event)}
          aria-labelledby="customized-dialog-title"
          open={settingsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={(event) => handleSettingsClose(event)}
          >
            Default Playground Settings
          </DialogTitle>

          <form onSubmit={handleSaveSettings}>
            <ThemeProvider theme={theme}>
              <DialogContent dividers>
                <DefaultPlatformSelection
                  handleDefaultPlatform={handleDefaultPlatform}
                />

                <CdmApiTokenToggle
                  handleCdmApiTokenState={handleCdmApiTokenState}
                />
                <PolarisDevelopmentModeToggle
                  handlePolarisDevModeState={handlePolarisDevModeState}
                />
              </DialogContent>
            </ThemeProvider>
            <DialogActions>
              <ThemeProvider theme={theme}>
                <Button type="submit" variant="contained" color="primary">
                  SAVE CHANGES
                </Button>
              </ThemeProvider>
            </DialogActions>
          </form>
        </Dialog>
      </React.Fragment>
    );
  };

  return settingsDialog();
}
