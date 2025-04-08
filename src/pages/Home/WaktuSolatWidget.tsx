/* eslint-disable react-hooks/exhaustive-deps */
import { JSX, useEffect, useState } from "react";
import {
  Box,
  Card,
  FormControl,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { WAKTU_SOLAT_MENGIKUT_ZON_LIST } from "../../constants";
import { useNotification } from "../../contexts";

interface FormattedWaktuSolat {
  fajr: string;
  syuruk: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface ZoneInfo {
  jakimCode: string;
  daerah: string;
  negeri: string;
}

const MobileContent = ({
  data,
  isLoading,
}: {
  data: FormattedWaktuSolat | null;
  isLoading: boolean;
}) => {
  const labels = ["Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"];
  const values = [
    data?.fajr,
    data?.syuruk,
    data?.dhuhr,
    data?.asr,
    data?.maghrib,
    data?.isha,
  ];

  return (
    <>
      <Grid size={6}>
        {labels.map((label, i) => (
          <Typography key={label} sx={{ mt: i === 0 ? 0 : 1 }}>
            {label}
          </Typography>
        ))}
      </Grid>
      <Grid size={6}>
        {values.map((value, i) => {
          if (isLoading)
            return (
              <Skeleton
                key={`skeleton-${i}`}
                sx={{
                  height: "auto",
                  width: "40%",
                  mt: i === 0 ? 0 : 1,
                  justifySelf: "end",
                }}
              />
            );
          return (
            <Typography
              key={`time-${i}`}
              sx={{ mt: i === 0 ? 0 : 1, textAlign: "end" }}
            >
              {value}
            </Typography>
          );
        })}
      </Grid>
    </>
  );
};

const DesktopContent = ({
  data,
  isLoading,
}: {
  data: FormattedWaktuSolat | null;
  isLoading: boolean;
}) => {
  const content = [
    { value: data?.fajr, label: "Subuh" },
    { value: data?.syuruk, label: "Syuruk" },
    { value: data?.dhuhr, label: "Zohor" },
    { value: data?.asr, label: "Asar" },
    { value: data?.maghrib, label: "Maghrib" },
    { value: data?.isha, label: "Isyak" },
  ];

  return (
    <>
      {content.map(({ value, label }, i) => (
        <Grid size={2} key={i}>
          {isLoading ? (
            <Skeleton
              key={`skeleton-${i}`}
              sx={{
                height: "auto",
                width: "40%",
                justifySelf: "center",
              }}
            />
          ) : (
            <Typography align="center">{value}</Typography>
          )}
          <Typography align="center">{label}</Typography>
        </Grid>
      ))}
    </>
  );
};

export const WaktuSolatWidget = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { showNotification } = useNotification();

  const [zon, setZon] = useState<string>("");
  const [formattedWaktuSolat, setFormattedWaktuSolat] =
    useState<FormattedWaktuSolat | null>(null);
  const [groupedZones, setGroupedZones] = useState<Record<string, ZoneInfo[]>>(
    {}
  );
  const [isZonesLoaded, setIsZonesLoaded] = useState(false);
  const [isWaktuSolatLoaded, setIsWaktuSolatLoaded] = useState(false);

  const today = moment();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedZon = event.target.value;
    setZon(selectedZon);
    localStorage.setItem("zonWaktuSolat", selectedZon);
  };

  const fetchWaktuSolat = async () => {
    if (!zon) return;

    setIsWaktuSolatLoaded(true);

    try {
      const { data } = await axios.get(
        `https://www.e-solat.gov.my/index.php?r=esolatApi/TakwimSolat&period=today&zone=${zon}`
      );

      if (data.status !== "OK!" || !data.prayerTime?.length) {
        showNotification("Could not fetch today's prayer times", "error");
        return;
      }

      const todayPrayers = data.prayerTime[0];

      setFormattedWaktuSolat({
        fajr: moment(todayPrayers.fajr, "HH:mm:ss").format("hh:mm a"),
        syuruk: moment(todayPrayers.syuruk, "HH:mm:ss").format("hh:mm a"),
        dhuhr: moment(todayPrayers.dhuhr, "HH:mm:ss").format("hh:mm a"),
        asr: moment(todayPrayers.asr, "HH:mm:ss").format("hh:mm a"),
        maghrib: moment(todayPrayers.maghrib, "HH:mm:ss").format("hh:mm a"),
        isha: moment(todayPrayers.isha, "HH:mm:ss").format("hh:mm a"),
      });
    } catch (error) {
      showNotification("Error fetching prayer times:" + error, "error");
    }

    setIsWaktuSolatLoaded(false);
  };

  const groupZonesByNegeri = () => {
    const grouped: Record<string, ZoneInfo[]> = {};

    for (const zone of WAKTU_SOLAT_MENGIKUT_ZON_LIST) {
      if (!grouped[zone.negeri]) grouped[zone.negeri] = [];
      grouped[zone.negeri].push(zone);
    }

    setGroupedZones(grouped);
    setIsZonesLoaded(true);
  };

  useEffect(() => {
    groupZonesByNegeri();
  }, []);

  useEffect(() => {
    if (isZonesLoaded) {
      const savedZon = localStorage.getItem("zonWaktuSolat");

      const exists = savedZon
        ? Object.values(groupedZones).some((zones) =>
            zones.some((z) => z.jakimCode === savedZon)
          )
        : false;

      const defaultZon = exists
        ? savedZon!
        : Object.values(groupedZones)[0]?.[0]?.jakimCode || "";

      setZon(defaultZon);
      localStorage.setItem("zonWaktuSolat", defaultZon);
    }
  }, [isZonesLoaded, groupedZones]);

  useEffect(() => {
    if (zon) fetchWaktuSolat();
  }, [zon]);

  const menuItems: JSX.Element[] = [];

  for (const [negeri, zones] of Object.entries(groupedZones)) {
    menuItems.push(
      <ListSubheader
        sx={{ color: "text.primary", fontWeight: "bold" }}
        key={`negeri-${negeri}`}
      >
        {negeri}
      </ListSubheader>
    );

    zones.forEach((zone) => {
      menuItems.push(
        <MenuItem key={zone.jakimCode} value={zone.jakimCode}>
          {zone.daerah}
        </MenuItem>
      );
    });
  }

  return (
    <>
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ bgcolor: "primary.light", py: 2 }}>
          <Typography
            sx={{
              fontWeight: "500",
              textAlign: "center",
              color: "primary.contrastText",
            }}
          >
            Waktu solat hari ini ({today.format("D MMMM YYYY")})
          </Typography>
        </Box>
        <Box sx={{ py: 3, px: 4 }}>
          <Grid container>
            {isMdUp ? (
              <DesktopContent
                data={formattedWaktuSolat}
                isLoading={isWaktuSolatLoaded}
              />
            ) : (
              <MobileContent
                data={formattedWaktuSolat}
                isLoading={isWaktuSolatLoaded}
              />
            )}
          </Grid>
        </Box>
      </Card>
      <FormControl fullWidth size="small">
        <InputLabel id="zon-select-label">Zon</InputLabel>
        <Select
          labelId="zon-select-label"
          id="zon-select"
          value={zon}
          label="Zon"
          onChange={handleChange}
        >
          {menuItems}
        </Select>
      </FormControl>
    </>
  );
};
