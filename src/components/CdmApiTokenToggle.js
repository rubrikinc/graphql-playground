import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

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
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText
          id="switch-list-label-wifi"
          primary="CDM API Token Authentication"
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            onChange={handleToggle("wifi")}
            checked={checked.indexOf("wifi") !== -1}
            inputProps={{ "aria-labelledby": "switch-list-label-wifi" }}
            color="primary"
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}
