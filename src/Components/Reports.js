import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function Body() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Welcome to Evis
      </Typography>
      <Typography variant="body1" align="center">
        Welcome to Reports Page
      </Typography>
    </Container>
  );
}

export default Body;
