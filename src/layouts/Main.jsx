import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

function Layout(props) {
  const token = localStorage.getItem("token");
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logOut = () => {
    localStorage.clear();
  };

  const toRegister = () => {
    navigate("/signup");
  };

  const toLogin = () => {
    navigate("/signin");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <img src="/itransition.jpeg" alt="logo" /> Itransition
      </Typography>
      <Divider />
      <List>
        {token ? (
          <ListItem onClick={logOut} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={"Log Out"} />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem onClick={toLogin} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={"Sign In"} />
              </ListItemButton>
            </ListItem>
            <ListItem onClick={toRegister} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={"Sign Up"} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <AppBar component="nav">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img
              src="/itransition.jpeg"
              style={{ width: "30px", marginRight: "5px" }}
              alt="logo"
            />
            Itransition
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {token ? (
              <Button onClick={logOut} sx={{ color: "#fff" }}>
                Log Out
              </Button>
            ) : (
              <>
                <Button onClick={toLogin} sx={{ color: "#fff" }}>
                  Sign In
                </Button>
                <Button onClick={toRegister} sx={{ color: "#fff" }}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>
          <Box component="div" sx={{ display: { xs: "flex", sm: "none" } }}>
            <img
              src="/itransition.jpeg"
              style={{ width: "30px", marginRight: "5px" }}
            />
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          p: 3,
        }}
      >
        <Toolbar />
        <Box component="div">{children}</Box>
      </Box>
    </Box>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
};

export default Layout;
