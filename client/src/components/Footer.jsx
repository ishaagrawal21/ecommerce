import React from "react";
import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        bgcolor: "#0f172a",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        color: "#94a3b8",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          © {new Date().getFullYear()} NEXUS Storefront. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
