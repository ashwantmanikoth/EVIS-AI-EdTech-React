import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "../css/body.css";

function Footer() {
  return (
      <Box component="footer" sx={{ bgcolor: "grey", p: 6 }} className="footer"  >
        <Typography variant="body1" color="white" textAlign="center" >
          © 2024 EVIS. All rights reserved.
        </Typography>
      </Box>
  );
}

export default Footer;
