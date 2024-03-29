import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "grey", p: 6 }}>
      <Typography variant="body1" color="white" textAlign="center">
        © 2024 Evis. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
