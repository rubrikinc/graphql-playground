import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const storage = window.localStorage;

const convertStringToBoolean = (string) => {
  let bool;
  string === "false" ? (bool = false) : (bool = true);
  return bool;
};

const CdmApiTokenToggle = ({ handleCdmApiTokenState }) => {
  const [state, setState] = React.useState(
    storage.getItem("cdmApiToken") === null
      ? false
      : convertStringToBoolean(storage.getItem("cdmApiToken"))
  );

  const handleChange = (event) => {
    setState(event.target.checked);
    handleCdmApiTokenState(event.target.checked);
  };

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText
          id="api-token-default"
          primary="Use an API Token for CDM Authentication"
        />
        <ListItemSecondaryAction>
          <FormControlLabel
            control={
              <Switch
                name="cdmApiToken"
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

export default CdmApiTokenToggle;
