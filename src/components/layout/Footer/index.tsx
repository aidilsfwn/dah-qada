import { Fragment } from "react";
import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <Fragment>
      <Typography
        gutterBottom
        variant="caption"
        textAlign={"center"}
        sx={{ opacity: 0.75 }}
      >
        react + vite + material ui | by aidil safwan
      </Typography>
    </Fragment>
  );
};

export default Footer;
