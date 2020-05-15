import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import CodeIcon from "@material-ui/icons/Code";

import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const storage = window.localStorage;

const convertStringToBoolean = (string) => {
  let bool;
  string === "false" ? (bool = false) : (bool = true);
  return bool;
};

const PolarisDevelopmentModeToggle = ({ handlePolarisDevModeState }) => {
  const [state, setState] = React.useState(
    storage.getItem("polarisDevMode") === null
      ? false
      : convertStringToBoolean(storage.getItem("polarisDevMode"))
  );

  const handleChange = (event) => {
    setState(event.target.checked);

    handlePolarisDevModeState(event.target.checked);
  };

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <CodeIcon />
        </ListItemIcon>
        <ListItemText
          id="polaris-development-mode-default"
          primary="Enable Polaris Development Mode"
        />
        <ListItemSecondaryAction>
          <FormControlLabel
            control={
              <Switch
                edge="end"
                onChange={handleChange}
                checked={state}
                color="primary"
              />
            }
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default PolarisDevelopmentModeToggle;
