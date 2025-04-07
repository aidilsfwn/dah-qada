import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h2" color="error">
        404 not found
      </Typography>
    </Box>
  );
};

export default NotFound;
