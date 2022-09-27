import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import classes from "./users.module.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import HttpsIcon from "@mui/icons-material/Https";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import { format } from "date-fns";
import en from "date-fns/locale/en-GB";
import EnhancedTableToolbar from "../../components/TableToolbar";
import EnhancedTableHead from "../../components/TableHead";

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
        toast.error(err.response.data.message);
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
      })
      .catch((err) => {
        toast.error(err.response.data.message);
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
      })
      .catch((err) => {
        toast.error(err.response.data.message);
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
      })
      .catch((err) => {
        toast.error("Something went wrong");
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
