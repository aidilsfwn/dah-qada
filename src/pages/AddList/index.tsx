import { useState } from "react";
import { Link, useNavigate } from "react-router";
import moment from "moment";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { db } from "../../db";

const WAKTU_SOLAT_LIST = [
  { value: "subuh", label: "subuh" },
  { value: "zohor", label: "zohor" },
  { value: "asar", label: "asar" },
  { value: "maghrib", label: "maghrib" },
  { value: "isyak", label: "isyak" },
];

const AddList = () => {
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedSalahTime, setSelectedSalahTime] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedSalahTime(event.target.value as string);
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
        tambah senarai
      </Typography>
      <Stack gap={3} sx={{ px: 2 }}>
        <DatePicker
          format="DD/MM/YYYY"
          label="tarikh"
          value={moment(date)}
          onChange={(val) => setDate(val?.format("YYYY-MM-DD") ?? "")}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">waktu solat</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedSalahTime}
            label="waktu solat"
            onChange={handleChange}
          >
            {WAKTU_SOLAT_LIST.map((item) => {
              return (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <TextField
          label="alasan"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Stack>
      <Stack direction={"row"} gap={4}>
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
            sx={{ textTransform: "none", mt: 4, mb: 2 }}
          >
            kembali
          </Button>
        </Link>
        <Button
          variant="contained"
          sx={{ textTransform: "none", mt: 4, mb: 2 }}
          onClick={async () => {
            await db.qadaSalah.add({
              date: date,
              salahTime: selectedSalahTime,
              reason: reason,
              status: "open",
            });
            navigate("/");
          }}
        >
          tambah
        </Button>
      </Stack>
    </Box>
  );
};

export default AddList;
