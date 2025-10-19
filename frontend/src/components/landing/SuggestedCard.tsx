"use client";

import { useCallback } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import StatusDot from "../common/StatusDot";
import GaugeMini from "../common/GaugeMini";
import FilterChip from "../common/FilterChip";
import type { SuggestedCard as SuggestedCardType } from "../../lib/types";
import * as analytics from "../../lib/analytics";

type SuggestedCardProps = {
  card: SuggestedCardType;
};

function formatDistance(distanceMeters: number) {
  const miles = distanceMeters / 1609.34;
  if (miles < 0.1) {
    return `${Math.round(distanceMeters)} meters`;
  }
  return `${miles.toFixed(1)} mi`;
}

export default function SuggestedCard({ card }: SuggestedCardProps) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    analytics.card_clicked(card.id);
    router.push(`/map?focus=${card.id}`);
  }, [card.id, router]);

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "background.paper",
        transition: (theme) => theme.transitions.create(["transform", "box-shadow"], {
          duration: theme.transitions.duration.shorter,
        }),
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 28px rgba(80,0,0,0.18)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={card.imageUrl}
        alt={card.name}
        sx={{
          height: 180,
          objectFit: "cover",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {card.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {formatDistance(card.distanceMeters)}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <StatusDot status={card.status} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {card.status}
            </Typography>
            <GaugeMini value={card.busyScore} />
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {card.tags.map((tag) => (
              <FilterChip key={tag} label={tag} size="small" readOnly />
            ))}
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleClick}
          sx={{ fontWeight: 700, borderRadius: "999px" }}
        >
          Go Now
        </Button>
      </CardActions>
    </Card>
  );
}

export function SuggestedCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Skeleton variant="rectangular" height={180} />
      <CardContent>
        <Stack spacing={1.5}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="rounded" width="60%" height={28} />
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 3, pb: 3 }}>
        <Skeleton variant="rounded" height={40} width="100%" />
      </CardActions>
    </Card>
  );
}
