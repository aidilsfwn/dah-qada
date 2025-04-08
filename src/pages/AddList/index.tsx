import { useState } from "react";
import { Link, useNavigate } from "react-router";
import moment from "moment";
import Dexie from "dexie";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { db } from "../../db";
import { useNotification } from "../../contexts";
import { WAKTU_SOLAT_LIST } from "../../constants";

const AddList = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [reason, setReason] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedSalahTime, setSelectedSalahTime] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isValid = selectedSalahTime.length > 0;

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedSalahTime(event.target.value as string);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      await db.qadaSalah.add({
        date: date,
        salahTime: selectedSalahTime,
        reason: reason,
        status: "open",
      });

      showNotification("Prayer record added successfully!", "success");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: unknown) {
      if (
        error instanceof Dexie.DexieError &&
        error.name === "ConstraintError"
      ) {
        showNotification("This prayer record already exists", "error");
      } else {
        showNotification("Failed to save. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Tambah Senarai
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Stack gap={3}>
        <DatePicker
          format="DD/MM/YYYY"
          label="Tarikh"
          value={moment(date)}
          onChange={(val) => setDate(val?.format("YYYY-MM-DD") ?? "")}
          sx={{ width: "100%" }}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Waktu Solat</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedSalahTime}
            label="Waktu Solat"
            onChange={handleChange}
          >
            {WAKTU_SOLAT_LIST.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Alasan"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
        />
      </Stack>

      <Grid container spacing={2} sx={{ mt: 5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Link
            to={"/"}
            style={{
              textDecoration: "none",
              WebkitTapHighlightColor: "transparent",
              WebkitTouchCallout: "none",
              userSelect: "none",
              width: "100%",
            }}
          >
            <Button variant="outlined" sx={{ textTransform: "none" }} fullWidth>
              Kembali
            </Button>
          </Link>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Button
            disabled={isSubmitting || !isValid}
            variant="contained"
            sx={{ textTransform: "none", borderRadius: 1 }}
            onClick={onSubmit}
            fullWidth
          >
            {isSubmitting ? "Menyimpan..." : "Tambah"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddList;
