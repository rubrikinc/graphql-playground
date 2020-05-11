import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import CodeIcon from "@material-ui/icons/Code";

export default function SwitchListSecondary() {
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
        <ListItemText
          id="switch-list-label-wifi"
          primary="Polaris Development Mode"
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
