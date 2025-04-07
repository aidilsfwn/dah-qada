import { useEffect, useState } from "react";
import { Link } from "react-router";
import moment from "moment";
import { Box, Button, Stack, Typography } from "@mui/material";

import { db, QadaSalah } from "../../db";

const ViewList = () => {
  const [list, setList] = useState<QadaSalah[]>([]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    const allSalahs = await db.qadaSalah.toArray();
    setList(allSalahs);
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
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        papar senarai
      </Typography>
      <Stack gap={1} sx={{ px: 2 }}>
        <>
          {list.map((item) => {
            return (
              <Stack
                key={item.id}
                direction={"row"}
                sx={{ justifyContent: "space-between", alignItems: "center" }}
                gap={3}
              >
                <Typography
                  noWrap
                  sx={{ opacity: item.status === "done" ? 0.5 : 1 }}
                >
                  {moment(item.date).format("D/M/YYYY")} - {item.salahTime} -{" "}
                  {item.reason}
                </Typography>
                <Stack direction={"row"} gap={1}>
                  <Button
                    disabled={item.status === "done"}
                    variant="contained"
                    sx={{ textTransform: "none" }}
                    size="small"
                    onClick={async () => {
                      await db.qadaSalah.update(item.id, {
                        status: "done",
                      });
                      fetchList();
                    }}
                  >
                    tanda selesai
                  </Button>
                  <Button
                    disabled={item.status === "done"}
                    variant="contained"
                    sx={{ textTransform: "none", bgcolor: "red" }}
                    size="small"
                    onClick={async () => {
                      await db.qadaSalah.delete(item.id);
                      fetchList();
                    }}
                  >
                    padam
                  </Button>
                </Stack>
              </Stack>
            );
          })}
        </>
      </Stack>
      <Link
        to={"/"}
        style={{
          WebkitTapHighlightColor: "transparent",
          WebkitTouchCallout: "none",
          userSelect: "none",
        }}
      >
        <Button
          variant="outlined"
          sx={{ textTransform: "none", mt: 4, mb: 2, mx: 2 }}
        >
          kembali
        </Button>
      </Link>
    </Box>
  );
};

export default ViewList;
