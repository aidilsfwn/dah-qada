import { Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface NicknameFormProps {
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
}

const NicknameForm = ({ setNickname }: NicknameFormProps) => {
  const [tempNickname, setTempNickname] = useState("");
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const handleSubmit = () => {
    localStorage.setItem("nickname", tempNickname);
    localStorage.setItem("zonWaktuSolat", "WLY01");
    setNickname(tempNickname);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        px: isMdUp ? 8 : 4, // Adjust padding based on screen size
      }}
    >
      <Stack sx={{ textAlign: "center", width: "100%" }}>
        <Typography variant="h5" sx={{ mb: 2 }} fontWeight="500">
          Welcome to
        </Typography>
        <Typography variant="h3" sx={{ mb: 5, fontWeight: "bold" }}>
          Dah Qada?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          How should we address you throughout your journey with us?
        </Typography>

        <TextField
          id="nickname"
          value={tempNickname}
          onChange={(e) => setTempNickname(e.target.value)}
          variant="outlined"
          autoFocus
          fullWidth
          sx={{ mb: 4, textAlign: "center" }}
          inputProps={{
            style: { textAlign: "center" },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            padding: "12px 24px",
            boxShadow: 3,
            "&:hover": { boxShadow: 6 },
          }}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export { NicknameForm };
