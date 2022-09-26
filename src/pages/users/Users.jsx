import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { format } from "date-fns";
import en from "date-fns/locale/en-GB";
import { Button, Checkbox, Container } from "@mui/material";
import HttpsIcon from "@mui/icons-material/Https";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import DeleteIcon from "@mui/icons-material/Delete";
import classes from "./users.module.scss";
import { toast } from "react-toastify";
import CustomCheckbox from "./Checkbox";
import EnhancedTable from "./UserTable";

const changeTime = (time) => {
  const newTime = format(new Date(time), "dd-MMMM, HH:mm", {
    locale: en,
  });
  return newTime;
};

export default function Users() {
  const [data, setData] = useState([]);
  const [all, setAll] = useState(false);
  const [valueByIds, setValueByIds] = useState([]);

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

  const handleBlock = (id) => {
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

  const handleDelete = (id) => {
    axios({
      url: `${BASE_URL}/users/${id}`,
      method: "DELETE",
    })
      .then((res) => {
        getUsers();
      })
      .catch((err) => {
        toast.error("Something went wrong!");
      });
  };

  const handleChangeAllId = (e) => {
    const values = data.map((item) => item._id);

    if (e.target.checked) {
      setValueByIds(values);
    } else {
      setValueByIds([]);
    }

    console.log(valueByIds);
  };

  const handleChangeOneId = (e, id) => {
    if (e.target.checked) {
      setValueByIds([...valueByIds, id]);
    } else {
      let filtered = valueByIds.filter((oneId) => oneId !== id);
      setValueByIds(filtered);
    }

    console.log(valueByIds);
  };

  const handler = (id) => {
    setValueByIds([...valueByIds, id]);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <Container>
      <Box sx={{ height: 635, width: "100%" }}>
        <div className={classes.tableHeader}>
          <div className={classes.selectAll}>
            <Checkbox
              {...label}
              onChange={handleChangeAllId}
              defaultChecked
              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            />
          </div>
          <div className={classes.selectAll}>
            <h3>ID</h3>
          </div>
          <div className={classes.selectAll}>
            <h3>Name</h3>
          </div>
          <div className={classes.selectAll}>
            <h3>Registration time</h3>
          </div>
          <div className={classes.selectAll}>
            <h3>Last entered</h3>
          </div>
          <div className={classes.selectAll}>
            <h3>Status</h3>
          </div>
          <div className={classes.selectAll}>
            <h3>Actions</h3>
          </div>
        </div>
        {data?.map(
          ({ _id, name, isBlocked, email, lastLog, timeStamp }, index) => {
            return (
              <div className={classes.tableBody} key={_id}>
                <div className={classes.selectAll}>
                  <CustomCheckbox
                    handler={handler}
                    setler={setValueByIds}
                    _id={_id}
                    values={valueByIds}
                  />
                  <Checkbox
                    {...label}
                    onChange={(e) => handleChangeOneId(e, _id)}
                    defaultChecked
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                  />
                </div>
                <div className={classes.selectAll}>
                  <h3>{index + 1}</h3>
                </div>
                <div className={classes.selectAll}>
                  <h3>{name}</h3>
                </div>
                <div className={classes.selectAll}>
                  <h3>{timeStamp}</h3>
                </div>
                <div className={classes.selectAll}>
                  <h3>{lastLog}</h3>
                </div>
                <div className={classes.selectAll}>
                  <h3
                    className={
                      isBlocked
                        ? classes.block + " " + classes.status
                        : classes.active + " " + classes.status
                    }
                  >
                    {isBlocked ? "blocked" : "active"}
                  </h3>
                </div>
                <div className={classes.selectAll + " " + classes.btnWrapper}>
                  <Button
                    variant="contained"
                    color={isBlocked ? "success" : "error"}
                    onClick={() => handleBlock(_id)}
                    className={classes.buttons}
                  >
                    {isBlocked ? <NoEncryptionIcon /> : <HttpsIcon />}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(_id)}
                    className={classes.buttons}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
            );
          }
        )}

        {/* <DataGrid
        rows={data}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      /> */}
      </Box>
      <EnhancedTable />
    </Container>
  );
}
