import { Fragment, JSX, useEffect, useState } from "react";
import {
  Box,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import moment from "moment";

import { WAKTU_SOLAT_MENGIKUT_ZON_LIST } from "../../constants";

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

export const WaktuSolatWidget = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Initialize state but don't set value until we know options are loaded
  const [zon, setZon] = useState<string>("");
  const [formattedWaktuSolat, setFormattedWaktuSolat] =
    useState<FormattedWaktuSolat | null>(null);
  const [groupedZones, setGroupedZones] = useState<any>({});
  const [isZonesLoaded, setIsZonesLoaded] = useState(false);

  const today = moment();

  const handleChange = (event: SelectChangeEvent) => {
    const newZon = event.target.value as string;
    setZon(newZon);
    localStorage.setItem("zonWaktuSolat", newZon);
  };

  const fetchWaktuSolat = async () => {
    if (!zon) return;

    try {
      const response = await axios.request({
        method: "GET",
        url:
          "https://www.e-solat.gov.my/index.php?r=esolatApi/TakwimSolat&period=today&zone=" +
          zon,
      });

      const data = response.data;

      if (
        data.status !== "OK!" ||
        !data.prayerTime ||
        data.prayerTime.length === 0
      ) {
        console.log("Could not fetch today's prayer times");
        return;
      }

      const todayPrayers = data.prayerTime[0];

      const formattedPrayers = {
        fajr: moment(todayPrayers.fajr, "HH:mm:ss").format("hh:mm a"),
        syuruk: moment(todayPrayers.syuruk, "HH:mm:ss").format("hh:mm a"),
        dhuhr: moment(todayPrayers.dhuhr, "HH:mm:ss").format("hh:mm a"),
        asr: moment(todayPrayers.asr, "HH:mm:ss").format("hh:mm a"),
        maghrib: moment(todayPrayers.maghrib, "HH:mm:ss").format("hh:mm a"),
        isha: moment(todayPrayers.isha, "HH:mm:ss").format("hh:mm a"),
      };
      setFormattedWaktuSolat(formattedPrayers);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };

  const groupZonesByNegeri = () => {
    const grouped: Record<string, ZoneInfo[]> = {};
    WAKTU_SOLAT_MENGIKUT_ZON_LIST.forEach((zone: ZoneInfo) => {
      const negeri = zone.negeri;
      if (!grouped[negeri]) {
        grouped[negeri] = [];
      }
      grouped[negeri].push(zone);
    });
    setGroupedZones(grouped);
    setIsZonesLoaded(true);
  };

  // Initialize zones on component mount
  useEffect(() => {
    groupZonesByNegeri();
  }, []);

  // Set the default zone after zones are loaded
  useEffect(() => {
    if (isZonesLoaded) {
      const savedZon = localStorage.getItem("zonWaktuSolat");

      // Check if the saved zone exists in our data
      let zonExists = false;
      if (savedZon) {
        // Type-safe iteration
        Object.values(groupedZones).forEach((zoneList: ZoneInfo[]) => {
          zoneList.forEach((zone: ZoneInfo) => {
            if (zone.jakimCode === savedZon) {
              zonExists = true;
            }
          });
        });
      }

      // Set to saved zone if it exists, otherwise use first available zone
      if (savedZon && zonExists) {
        setZon(savedZon);
      } else {
        // Default to first available zone
        const firstNegeri = Object.keys(groupedZones)[0];
        if (firstNegeri && groupedZones[firstNegeri].length > 0) {
          const defaultZon = groupedZones[firstNegeri][0].jakimCode;
          setZon(defaultZon);
          localStorage.setItem("zonWaktuSolat", defaultZon);
        }
      }
    }
  }, [isZonesLoaded, groupedZones]);

  // Fetch prayer times whenever the zone changes
  useEffect(() => {
    if (zon) {
      fetchWaktuSolat();
    }
  }, [zon]);

  // Prepare menu items as an array to avoid Fragment issues
  const menuItems: JSX.Element[] = [];

  for (const [negeri, zones] of Object.entries(groupedZones)) {
    // Add negeri header
    menuItems.push(
      <Typography
        key={`negeri-${negeri}`}
        sx={{ fontWeight: "bold", paddingLeft: 2, paddingTop: 1 }}
      >
        {negeri}
      </Typography>
    );

    // Add zone items for this negeri
    for (const zone of zones) {
      menuItems.push(
        <MenuItem key={zone.jakimCode} value={zone.jakimCode}>
          {zone.daerah}
        </MenuItem>
      );
    }
  }

  return (
    <Fragment>
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
        <Box sx={{ bgcolor: "background.primary", py: 3, px: 4 }}>
          <Grid container>
            {isMdUp ? (
              <DesktopContent data={formattedWaktuSolat} />
            ) : (
              <MobileContent data={formattedWaktuSolat} />
            )}
          </Grid>
        </Box>
      </Card>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Zon</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={zon}
          label="Zon"
          onChange={handleChange}
          size="small"
        >
          {menuItems}
        </Select>
      </FormControl>
    </Fragment>
  );
};

const MobileContent = ({ data }: { data: FormattedWaktuSolat | null }) => {
  return (
    <Fragment>
      <Grid size={6}>
        {["Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"].map(
          (item, index) => {
            return (
              <Typography key={item} sx={{ mt: index === 0 ? 0 : 1 }}>
                {item}
              </Typography>
            );
          }
        )}
      </Grid>
      <Grid size={6}>
        {[
          data?.fajr,
          data?.syuruk,
          data?.dhuhr,
          data?.asr,
          data?.maghrib,
          data?.isha,
        ].map((item, index) => {
          return (
            <Typography
              key={`time-${index}`}
              sx={{ mt: index === 0 ? 0 : 1, textAlign: "end" }}
            >
              {item}
            </Typography>
          );
        })}
      </Grid>
    </Fragment>
  );
};

const DesktopContent = ({ data }: { data: FormattedWaktuSolat | null }) => {
  const content = [
    { value: data?.fajr, label: "Subuh" },
    { value: data?.syuruk, label: "Syuruk" },
    { value: data?.dhuhr, label: "Zohor" },
    { value: data?.asr, label: "Asar" },
    { value: data?.maghrib, label: "Maghrib" },
    { value: data?.isha, label: "Isyak" },
  ];

  return (
    <Fragment>
      {content.map((item, index) => {
        return (
          <Grid size={2} key={`desktop-${index}`}>
            <Typography align="center">{item.value}</Typography>
            <Typography align="center">{item.label}</Typography>
          </Grid>
        );
      })}
    </Fragment>
  );
};
