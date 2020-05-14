import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const CdmApiTokenToggle = ({ handleCdmApiTokenState }) => {
  const [disabled, setDisabledState] = React.useState(false);

  const handleToggle = () => () => {
    disabled === true ? setDisabledState(false) : setDisabledState(true);
    handleCdmApiTokenState(disabled);
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

export default CdmApiTokenToggle;
