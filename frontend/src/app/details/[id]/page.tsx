"use server";

import { notFound } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";
import { getLocationById } from "../../../lib/locations";
import type { LocationDetail } from "../../../types/locations";
import DetailsActionBar from "./DetailsActionBar";

function metersToMilesLabel(distanceMeters?: number): string | null {
  if (distanceMeters == null) return null;
  const miles = distanceMeters / 1609.344;
  return `${miles.toFixed(1)} mi`;
}

function statusColor(status?: string): "success" | "warning" | "error" | "default" {
  if (!status) return "default";
  const token = status.toLowerCase();
  if (token.includes("quiet")) return "success";
  if (token.includes("moderate")) return "warning";
  if (token.includes("busy")) return "error";
  return "default";
}

export default async function DetailsPage({ params }: { params: { id: string } }) {
  const location: LocationDetail | null = await getLocationById(params.id);

  if (!location) {
    notFound();
  }

  const distanceLabel = metersToMilesLabel(location.distanceMeters);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs aria-label="breadcrumbs" sx={{ mb: 2 }}>
        <Link href="/">Home</Link>
        <Link href="/explore">Explore</Link>
        <Typography color="text.primary">{location.name}</Typography>
      </Breadcrumbs>

      <Card sx={{ mb: 3, overflow: "hidden", borderRadius: 2 }}>
        {location.imageUrl ? (
          <CardMedia
            component="img"
            src={location.imageUrl}
            alt={location.name}
            sx={{ maxHeight: 260, objectFit: "cover" }}
          />
        ) : null}
        <CardContent>
          <Box
            display="flex"
            alignItems={{ xs: "flex-start", md: "center" }}
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
            justifyContent="space-between"
          >
            <Typography variant="h4" component="h1">
              {location.name}
            </Typography>
            {distanceLabel ? <Chip label={distanceLabel} variant="outlined" /> : null}
          </Box>
          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            {location.statusText ? (
              <Chip label={location.statusText} color={statusColor(location.statusText)} />
            ) : null}
            {location.tags?.map((tag) => (
              <Chip key={tag} label={tag} variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={7}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            About
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {location.description}
          </Typography>

          {location.amenities?.length ? (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Amenities
              </Typography>
              <List dense>
                {location.amenities.map((amenity) => (
                  <ListItem key={amenity} disableGutters>
                    <ListItemText primary={amenity} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : null}

          {location.hours?.length ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Hours
              </Typography>
              <Table size="small" aria-label="hours table">
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Open</TableCell>
                    <TableCell>Close</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {location.hours.map((entry) => (
                    <TableRow key={entry.day}>
                      <TableCell>{entry.day}</TableCell>
                      <TableCell>{entry.open}</TableCell>
                      <TableCell>{entry.close}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : null}
        </Grid2>

        <Grid2 xs={12} md={5} display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Location
            </Typography>
            {location.address ? <Typography sx={{ mb: 0.5 }}>{location.address}</Typography> : null}
            {location.campusArea ? (
              <Typography variant="body2" color="text.secondary">
                {location.campusArea}
              </Typography>
            ) : null}
          </Box>

          <DetailsActionBar loc={location} />
        </Grid2>
      </Grid2>
    </Container>
  );
}


