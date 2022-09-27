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

export default function Users() {
  return (
    <Container>
      <EnhancedTable />
    </Container>
  );
}
