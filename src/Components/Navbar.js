import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { Avatar, Popover } from "@mui/material";

function Navbar() {
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    // Retrieve the username from session storage
    const storedUsername = sessionStorage.getItem("userName");
    if (storedUsername) {
      setUsername(storedUsername);
      console.log("sett");
    }
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    // Clear session storage and any sign-out logic
    sessionStorage.clear();

    // try {
    //   console.log(text);
    //   const response = await fetch("/api/data/signout", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ text }),
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   console.log(data);
    //   // Assuming 'data' has the 'Entities' structure as shown
    //   setKeyPhrases(data.KeyPhrases);
    //   //   console.log(keyPhrases)
    // } catch (error) {
    //   console.error("Error:", error);
    // }

    console.log("User signed out");
    handleClose(); // Close the popover
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogin = () => {
    window.location.href =
      "https://evis-auth.auth.us-east-1.amazoncognito.com/login?client_id=23vl1an4efj02v4k6aedb1cfh4&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2F54.234.7.50%2F";
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
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem component={Link} to="/" onClick={handleClose}>
            Home
          </MenuItem>
          <MenuItem component={Link} to="/roomcreate" onClick={handleClose}>
            My Rooms
          </MenuItem>
          <MenuItem component={Link} to="/roomjoin" onClick={handleClose}>
            Join Rooms
          </MenuItem>
          <MenuItem component={Link} to="/userprofile" onClick={handleClose}>
            get Userprofile
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <a
              href="https://evis-auth.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=23vl1an4efj02v4k6aedb1cfh4&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Sign Up
            </a>
          </MenuItem>

          <MenuItem component={Link} to="/aboutus" onClick={handleClose}>
            About Us
          </MenuItem>

          <MenuItem onClick={handleClose}>My Account</MenuItem>
        </Menu>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Evis
        </Typography>

        <div>
          {username && (
            <Avatar
              sx={{ bgcolor: "secondary.main", cursor: "pointer" }}
              onClick={handleClick}
            >
              T
            </Avatar>
          )}
          {/* <Popover
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
            </Typography> */}
          <Button onClick={handleSignOut} sx={{ m: 1 }}>
            Sign Out
          </Button>
          {/* </Popover> */}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
