import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";
import { alpha } from "@mui/material/styles";
import HttpsIcon from "@mui/icons-material/Https";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import PropTypes from "prop-types";

const EnhancedTableToolbar = ({
  numSelected = [],
  handleDeleteMany,
  handleBlockMany,
}) => {
  const [isBlocked, setIsblocked] = useState(false);

  const block = () => {
    handleBlockMany(numSelected);
    setIsblocked(!isBlocked);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected.length > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected.length > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected.length} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Users
        </Typography>
      )}

      {numSelected.length > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteMany(numSelected)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={isBlocked ? "Unlock" : "Block"}>
            {isBlocked ? (
              <IconButton onClick={block}>
                <NoEncryptionIcon />
              </IconButton>
            ) : (
              <IconButton onClick={block}>
                <HttpsIcon />
              </IconButton>
            )}
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.array.isRequired,
};

export default EnhancedTableToolbar;
