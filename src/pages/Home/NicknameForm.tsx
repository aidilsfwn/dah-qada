import { Dispatch, SetStateAction, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

interface NicknameFormProps {
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
}

const NicknameForm = ({ setNickname }: NicknameFormProps) => {
  const [tempNickname, setTempNickname] = useState("");

  const handleSubmit = () => {
    localStorage.setItem("nickname", tempNickname);
    setNickname(tempNickname);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      gap={4}
    >
      <Typography variant="h5" textAlign={"center"}>
        assalamualaikum wbt... <br /> welcome to dah qada!
        <br /> what should we call you?
      </Typography>
      <TextField
        id="nickname"
        value={tempNickname}
        onChange={(e) => setTempNickname(e.target.value)}
        variant="outlined"
        autoFocus
        slotProps={{
          htmlInput: { style: { textAlign: "center" } },
        }}
      />
      <Button
        variant="outlined"
        onClick={handleSubmit}
        sx={{ textTransform: "none" }}
      >
        submit
      </Button>
    </Box>
  );
};

export { NicknameForm };
