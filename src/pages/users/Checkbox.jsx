import { Checkbox } from "@mui/material";
import React, { useState } from "react";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const CustomCheckbox = ({ handler, setler, _id, values = [] }) => {
  const [checked, setIssChecked] = useState(values.includes(_id));
  const ownHandler = (e) => {
    console.log(e.target.checked);
    if (e.target.checked && values.length) {
      console.log(values);
      console.log(_id);
      let filteredValues = Array.isArray(values)
        ? values.filer((item) => item != _id)
        : values;
      setler(filteredValues);
      setIssChecked(false);
    } else {
      setIssChecked(true);
      handler(_id);
    }
    console.log(values);
  };
  return (
    <Checkbox
      {...label}
      checked={checked}
      onChange={ownHandler}
      defaultChecked
      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
    />
  );
};

export default CustomCheckbox;
