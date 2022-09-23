import React from "react";
import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const Login = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleLog = () => {
    console.log(data);
  };

  return (
    <div
      className="login"
      style={{
        height: "calc(100vh - 150px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form>
        <Box
          component="div"
          className="wrapper"
          style={{ width: "400px", marginInline: "auto" }}
        >
          <Typography variant="h3" align="center" my={2}>
            Sign In
          </Typography>
        </Box>
        <Box
          component="div"
          className="wrapper"
          style={{ width: "400px", marginInline: "auto" }}
        >
          <TextField
            type="text"
            name="name"
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={data.name}
            onChange={handleChange}
            sx={{ width: "100%", marginBottom: "10px", marginInline: "auto" }}
          />
        </Box>
        <Box
          component="div"
          className="wrapper"
          style={{ width: "400px", marginInline: "auto" }}
        >
          <TextField
            type="email"
            name="email"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={data.email}
            onChange={handleChange}
            sx={{ width: "100%", marginBottom: "10px", marginInline: "auto" }}
          />
        </Box>
        <Box
          className="wrapper"
          style={{ width: "400px", marginInline: "auto" }}
          sx={{ width: "100%" }}
        >
          <TextField
            type="password"
            name="password"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            value={data.password}
            onChange={handleChange}
            sx={{ width: "100%", marginBottom: "10px", marginInline: "auto" }}
          />
        </Box>
        <div
          className="wrapper"
          style={{ width: "400px", marginInline: "auto" }}
        >
          <Button
            variant="contained"
            sx={{ width: "100%", marginBottom: "10px", marginInline: "auto" }}
            color="success"
            onClick={handleLog}
          >
            Log In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
