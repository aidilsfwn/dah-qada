import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Stack, Typography } from "@mui/material";

import { NicknameForm } from "./NicknameForm";

const Home = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) setNickname(storedNickname);
  }, []);

  if (!nickname)
    return <NicknameForm nickname={nickname} setNickname={setNickname} />;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      gap={3}
    >
      <Typography variant="h5" textAlign={"center"}>
        assalamualaikum wbt, {nickname}...
      </Typography>
      <Stack gap={2}>
        <Button
          onClick={() => navigate("/add-list")}
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          tambah senarai
        </Button>
        <Button
          variant="outlined"
          sx={{ textTransform: "none" }}
          onClick={() => navigate("/view-list")}
        >
          papar senarai
        </Button>
      </Stack>
    </Box>
  );
};

export default Home;
