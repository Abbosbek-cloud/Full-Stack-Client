import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { Button } from "@mui/material";
import classes from "./users.module.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import HttpsIcon from "@mui/icons-material/Https";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import { useState } from "react";
import { format } from "date-fns";
import en from "date-fns/locale/en-GB";

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    field: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "timeStamp",
    numeric: true,
    disablePadding: false,
    label: "Registration time",
  },
  {
    id: "lastLog",
    numeric: true,
    disablePadding: false,
    label: "Last entered",
  },
  {
    id: "isBlocked",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "actions",
    field: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected.length === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.array.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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

export default function EnhancedTable() {
  const [data, setData] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const changeTime = (time) => {
    const newTime = format(new Date(time), "dd-MMMM, HH:mm", {
      locale: en,
    });
    return newTime;
  };

  const getUsers = async () => {
    await axios({
      url: `${BASE_URL}/users`,
      method: "get",
    })
      .then((res) => {
        let newData = res.data.map((user, indx) => {
          return {
            ...user,
            timeStamp: changeTime(user.timeStamp),
            lastLog: changeTime(user.lastLog),
            id: indx + 1,
          };
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBlockMany = (users) => {
    axios({
      url: `${BASE_URL}/users/many`,
      method: "put",
      data: {
        users: users,
      },
    })
      .then((res) => {
        getUsers();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteMany = (users) => {
    axios({
      url: `${BASE_URL}/users/many`,
      method: "delete",
      data: {
        users: users,
      },
    })
      .then((res) => {
        getUsers();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const blockOne = (id) => {
    axios({
      url: `${BASE_URL}/users`,
      method: "PUT",
      data: { _id: id },
    })
      .then((res) => {
        getUsers();
      })
      .catch((err) => toast.error("Error occured!"));
  };

  const deleteOne = (id) => {
    axios({
      url: `${BASE_URL}/users/${id}`,
      method: "DELETE",
    })
      .then((res) => {
        getUsers();
        console.log(res);
      })
      .catch((err) => {
        // toast.error("Something went wrong!");
        console.log(err);
      });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  React.useEffect(() => {
    getUsers();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          getUsers={getUsers}
          handleBlockMany={handleBlockMany}
          handleDeleteMany={handleDeleteMany}
          numSelected={selected}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.timeStamp}</TableCell>
                      <TableCell align="right">{row.lastLog}</TableCell>
                      <TableCell align="right">
                        <div className={classes.selectAll}>
                          <h3
                            className={
                              row.isBlocked
                                ? classes.block + " " + classes.status
                                : classes.active + " " + classes.status
                            }
                          >
                            {row.isBlocked ? "blocked" : "active"}
                          </h3>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <div
                          className={
                            classes.selectAll + " " + classes.btnWrapper
                          }
                        >
                          <Button
                            variant="contained"
                            color={row?.isBlocked ? "success" : "error"}
                            onClick={() => blockOne(row._id)}
                            className={classes.buttons}
                          >
                            {row.isBlocked ? (
                              <NoEncryptionIcon />
                            ) : (
                              <HttpsIcon />
                            )}
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteOne(row._id)}
                            className={classes.buttons}
                          >
                            <DeleteIcon />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
