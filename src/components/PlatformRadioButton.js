import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import CodeIcon from "@material-ui/icons/Code";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

export default function SwitchListSecondary() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(["wifi"]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <CodeIcon />
        </ListItemIcon>
        <ListItemText id="switch-list-label-wifi" primary="Default Platform" />
        <ListItemSecondaryAction>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="position"
              name="position"
              defaultValue="top"
            >
              <FormControlLabel
                value="none"
                control={<Radio color="primary" />}
                label="None"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="CDM"
                control={<Radio color="primary" />}
                label="CDM"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="Polaris"
                control={<Radio color="primary" />}
                label="Polaris"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}
