import { Fragment } from "react";
import { AppBar, Typography } from "@mui/material";

const Header = () => {
  return (
    <Fragment>
      <AppBar position="sticky" sx={{ py: 2 }}>
        <Typography variant="h5" textAlign={"center"}>
          Dah Qada?
        </Typography>
      </AppBar>
    </Fragment>
  );
};

export default Header;
