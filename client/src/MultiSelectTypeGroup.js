import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const types = [
  'sports','study','group event','dining','charity','business'
];

function getStyles(type, selectedTypes, theme) {
  return {
    fontWeight:
      selectedTypes.indexOf(type) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultiSelectTypeGroup(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedTypes, updateSelectedTypes] = React.useState([]);

  const handleChange = (event) => {
    updateSelectedTypes(event.target.value);
    props.onChange(event);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>Types</InputLabel>
        <Select
          multiple
          value={selectedTypes}
          onChange={handleChange}
          input={<Input />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {types.map((type) => (
            <MenuItem key={type} value={type} style={getStyles(type, selectedTypes, theme)}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}