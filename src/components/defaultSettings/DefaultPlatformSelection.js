import React from "react";

import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import DesktopMacIcon from "@material-ui/icons/DesktopMac";

// Used to format the Select dropdown
const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: 150,
    marginRight: 20,
  },
}));

const storage = window.localStorage;

const DefaultPlatform = ({ handleDefaultPlatform }) => {
  const classes = useStyles();
  const [platform, setPlatform] = React.useState(
    storage.getItem("platform") === null ? "none" : storage.getItem("platform")
  );

  const handleChange = (event) => {
    setPlatform(event.target.value);
    handleDefaultPlatform(event.target.value);
  };

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <DesktopMacIcon />
        </ListItemIcon>
        <ListItemText
          id="switch-list-label-button"
          primary="Set the Default Platform"
        />
        <ListItemSecondaryAction>
          <FormControl className={classes.formControl}>
            <Select
              labelId="demo-dialog-select-label"
              id="demo-dialog-select"
              value={platform}
              onChange={handleChange}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="cdm">CDM</MenuItem>
              <MenuItem value="polaris">Polaris</MenuItem>
            </Select>
          </FormControl>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default DefaultPlatform;
