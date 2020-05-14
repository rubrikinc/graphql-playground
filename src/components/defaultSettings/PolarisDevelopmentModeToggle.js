import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import CodeIcon from "@material-ui/icons/Code";

import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const PolarisDevelopmentModeToggle = ({ handlePolarisDevModeState }) => {
  const [disabled, setDisabledState] = React.useState(true);

  const handleToggle = () => () => {
    disabled === true ? setDisabledState(false) : setDisabledState(true);
    // console.log(disabled);
    handlePolarisDevModeState(disabled);
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
                onChange={handleToggle()}
                checked={disabled}
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
