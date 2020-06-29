import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import LanguageIcon from "@material-ui/icons/Language";
import TextField from "@material-ui/core/TextField";

const storage = window.localStorage;

const PolarisDevelopmentDevDomain = ({ handlePolarisDevDomain }) => {
  const [devDomain, setDevDomain] = React.useState(
    storage.getItem("polarisDevDomain") === null
      ? "dev"
      : storage.getItem("polarisDevDomain")
  );

  const handleChange = (event) => {
    setDevDomain(event.target.value);
    handlePolarisDevDomain(event.target.value);
  };

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <LanguageIcon />
        </ListItemIcon>
        <ListItemText
          id="polaris-development-domain"
          primary="Polaris Development Domain"
        />
        <ListItemSecondaryAction>
          <TextField
            id="standard-basic"
            defaultValue={devDomain}
            onChange={handleChange}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default PolarisDevelopmentDevDomain;
