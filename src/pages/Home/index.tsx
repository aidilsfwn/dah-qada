import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { NicknameForm } from "./NicknameForm";
import { WaktuSolatWidget } from "./WaktuSolatWidget";
import { Layout } from "../../components/layout/Layout";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) setNickname(storedNickname);
  }, []);

  if (!nickname)
    return <NicknameForm nickname={nickname} setNickname={setNickname} />;

  return (
    <Layout>
      <Box sx={{ p: isMdUp ? 4 : 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="textSecondary">
            Assalamualaikum,
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {nickname}
          </Typography>
        </Box>
        <Stack gap={3} sx={{ my: 5 }}>
          <Button
            onClick={() => navigate("/add-list")}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 3,
              padding: "12px 24px",
              "&:hover": { boxShadow: 6 },
            }}
          >
            Tambah Dalam Senarai
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 3,
              padding: "12px 24px",
              "&:hover": { boxShadow: 6 },
            }}
            onClick={() => navigate("/view-list")}
          >
            Lihat Senarai
          </Button>
        </Stack>
        <WaktuSolatWidget />
      </Box>
    </Layout>
  );
};

export default Home;
