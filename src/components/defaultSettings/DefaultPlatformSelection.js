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

const useStyles = makeStyles((theme) => ({
  container: {
    display: "inline-flex",
    flexWrap: "wrap",
  },
  formControl: {
    minWidth: 100,
    marginRight: 20,
  },
}));

const DefaultPlatform = ({ handleDefaultPlatform }) => {
  const classes = useStyles();
  const [platform, setPlatform] = React.useState("None");

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
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="CDM">CDM</MenuItem>
              <MenuItem value="Polaris">Polaris</MenuItem>
            </Select>
          </FormControl>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default DefaultPlatform;
