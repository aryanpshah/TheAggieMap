"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Shell from "../layout/Shell";

export default function PrivacyPage() {
  return (
    <Shell activePath="/privacy">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Privacy at The Aggie Map
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We respect your hustle and the routes you take across campus. Here’s how we keep it tidy.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: (theme) => `${theme.palette.primary.main}22` }} />

          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              What we collect
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We store the search queries you type and the crowd pings you submit so we can surface the best study corners and dining tips. Device type and rough location help us show places near you. Sensitive details like exact GPS trails are not collected.
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              How we use it
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Data powers live crowd scores, leaderboard style highlights, and anonymous trends that help other Aggies dodge long lines. We never sell your information. Aggregated insights may be shared with campus partners to improve services.
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Your choices
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unhappy with a ping you submitted? Reach out via support@theaggiemap.com and we will scrub it. Clearing your browser cache removes locally stored preferences.
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Questions about privacy? Ping the team at privacy@theaggiemap.com and we will get back before your next study break.
          </Typography>
        </Stack>
      </Container>
    </Shell>
  );
}
