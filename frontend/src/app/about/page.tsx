"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Shell from "../layout/Shell";

export default function AboutPage() {
  return (
    <Shell activePath="/about">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              About The Aggie Map
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We built this little campus compass to help Aggies reclaim their time and study energy.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: (theme) => `${theme.palette.primary.main}22` }} />

          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Who we are
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We are a team of four Texas A&M freshmen who have paced between libraries, cafes, and dining halls more times than we can count.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              After too many evenings roaming Evans, the MSC, and Zachry looking for open seats or short food lines, we decided to map the crowd pulse for everyone.
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Why it matters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crowd Ping reports, live occupancy data, and curated recommendations make it easier to find a quiet nook or a snack without waiting forever. The Aggie Map is the tool we wish existed when we first stepped on campus.
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Reach out at team@aggiemap.edu if you want to collaborate, suggest a feature, or just share your favorite study spot.
          </Typography>
        </Stack>
      </Container>
    </Shell>
  );
}
