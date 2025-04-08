import { useEffect, useState } from "react";
import { Link } from "react-router";
import moment from "moment";
import {
  Box,
  Button,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DoneIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

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
    <Box sx={{ px: 2, py: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Papar Senarai
      </Typography>

      <Stack spacing={1.5}>
        {list.map((item) => (
          <Accordion
            key={item.id}
            disabled={item.status === "done"}
            sx={{
              opacity: item.status === "done" ? 0.5 : 1,
              borderLeft:
                item.status === "done"
                  ? "6px solid green"
                  : "6px solid #1976d2",
              transition: "opacity 0.3s ease",
              borderRadius: 1,
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography variant="subtitle1">
                  {moment(item.date).format("D MMM YYYY")} – {item.salahTime}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Alasan: {item.reason}
              </Typography>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Tooltip title="Tanda Selesai">
                  <span>
                    <IconButton
                      color="success"
                      size="small"
                      disabled={item.status === "done"}
                      onClick={async () => {
                        await db.qadaSalah.update(item.id, { status: "done" });
                        fetchList();
                      }}
                    >
                      <DoneIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Padam">
                  <span>
                    <IconButton
                      color="error"
                      size="small"
                      disabled={item.status === "done"}
                      onClick={async () => {
                        await db.qadaSalah.delete(item.id);
                        fetchList();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      <Box mt={5}>
        <Link
          to={"/"}
          style={{
            textDecoration: "none",
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            userSelect: "none",
          }}
        >
          <Button fullWidth variant="outlined" sx={{ textTransform: "none" }}>
            Kembali
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default ViewList;
