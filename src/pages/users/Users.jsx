import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { format } from "date-fns";
import en from "date-fns/locale/en-GB";
import { Button } from "@mui/material";
import HttpsIcon from "@mui/icons-material/Https";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "@emotion/styled";

const CustomButton = styled(Button)({
  "&": {
    padding: 0,
    maxWidth: "30px",
    maxHeight: "30px",
    minWidth: "30px",
    minHeight: "30px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const columns = [
  { field: "id", headerName: "ID", width: 60 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
    editable: true,
  },
  {
    field: "lastLog",
    headerName: "Last login",
    type: "number",
    width: 170,
    editable: true,
    align: "left",
  },
  {
    field: "isBlocked",
    headerName: "Status",
    description: "This column has a value getter and is not sortable.",
    sortable: true,
    width: 160,
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    renderCell: (params) => {
      console.log(params);
      return (
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0",
          }}
        >
          <CustomButton
            variant="contained"
            color={params?.row?.isBlocked ? "success" : "error"}
            sx={{
              maxWidth: "30px",
              borderRadius: "50%",
              height: "40px",
              padding: 0,
            }}
          >
            {params?.row?.isBlocked ? (
              <NoEncryptionIcon fontSiz="40px" />
            ) : (
              <HttpsIcon fontSize="40px" />
            )}
          </CustomButton>
          <CustomButton variant="contained" color="error">
            <DeleteIcon fontSize="40px" />
          </CustomButton>
        </Box>
      );
    },
  },
];

const changeTime = (time) => {
  const newTime = format(new Date(time), "dd-MMMM, HH:mm", {
    locale: en,
  });
  return newTime;
};

export default function Users() {
  const [data, setData] = useState([]);

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
        console.log(res.data);
        console.log(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <Box sx={{ height: 635, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
