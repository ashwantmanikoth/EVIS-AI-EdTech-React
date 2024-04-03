import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useAsyncValue } from "react-router-dom";
import { Avatar, Popover } from "@mui/material";
import { Context } from "../App";

function Navbar() {
  const [isSignedIn, setIsSignedIn] = useContext(Context);
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const open = Boolean(anchorEl);
  const openMenu = Boolean(anchorElMenu);

  const id = open ? "simple-popover" : undefined;
  const cognito_url = process.env.REACT_APP_COGNIO_HOSTED_UI_SIGNIN_LINK;
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("userName");
    if (storedUsername) {
      setUsername(storedUsername);
      console.log("sett");
    }
  });

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };
  const handleSignOut = async () => {
    // Clear session storage and any sign-out logic

    try {
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken === undefined) {
        throw new Error("No access token found");
      }

      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (response.status == 200) {
        sessionStorage.clear();
        setIsSignedIn(false);
        // useEffect();
        console.log(isSignedIn);
      }
    } catch (err) {}
    handleClose(); // Close the popover
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleLogin = () => {
    window.location.href = ""; //paste your cognito link here
    console.log("Redirecting to login...");
  };

  return (
    <AppBar
      position="static"
      sx={{ background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)" }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleClickMenu}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={openMenu}
          onClose={handleCloseMenu}
        >
          <MenuItem component={Link} to="/" onClick={handleCloseMenu}>
            Home
          </MenuItem>
          {/* <MenuItem component={Link} to="/roomcreate" onClick={handleCloseMenu}>
            My Rooms
          </MenuItem>
          <MenuItem component={Link} to="/roomjoin" onClick={handleCloseMenu}>
            Join Rooms
          </MenuItem>
          <MenuItem component={Link} to="/userprofile" onClick={handleCloseMenu}>
            get Userprofile
          </MenuItem> */}

          <MenuItem onClick={handleCloseMenu}>
            <a
              href="https://evis-student.auth.us-east-1.amazoncognito.com/login?client_id=1e5ud4pjf6afm1j30s49apgiih&response_type=code&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback"
              // href="https://evis-auth.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=79jp9ca6spjm548a9o4pn2vs0f&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Sign Up Student
            </a>
          </MenuItem>

          <MenuItem onClick={handleCloseMenu}>
            <a
              href="https://evis-professors.auth.us-east-1.amazoncognito.com/login?client_id=7nsa0cqntm824rhqvo389r73eu&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback%2Fprofessor"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Sign Up Professor
            </a>
          </MenuItem>

          <MenuItem component={Link} to="/aboutus" onClick={handleCloseMenu}>
            About Us
          </MenuItem>

          <MenuItem onClick={handleClose}>My Account</MenuItem>
        </Menu>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Evis
        </Typography>

        <div>
          {isSignedIn ? (
            <Avatar
              sx={{ bgcolor: "#AFE1AF", cursor: "pointer" }}
              onClick={handleClick}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            ""
          )}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Typography sx={{ p: 2 }}>
              Signed in as <strong>{username}</strong>
            </Typography>
            <Button onClick={handleSignOut} sx={{ m: 1 }}>
              Sign Out
            </Button>
          </Popover>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
