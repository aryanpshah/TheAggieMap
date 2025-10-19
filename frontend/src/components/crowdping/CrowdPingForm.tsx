"use client";

import { useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import { sanitizeInput } from "../../utils/sanitize";
import FormSection from "./FormSection";

const CAMPUS_SPOTS = [
  "Sbisa Dining Hall",
  "Southside Commons",
  "Evans Library",
  "Evans Library (4th Floor Quiet)",
  "Zachry Engineering Education Complex",
  "Memorial Student Center",
  "Student Recreation Center",
  "PEAP Building",
  "Aggie Park",
  "Rudder Plaza",
  "MSC Flag Room",
  "West Campus Library",
];

const VIBE_OPTIONS = ["Focused", "Chill", "Social", "Energetic", "Stressful", "Neutral"] as const;

export type CrowdPingFormValues = {
  place: string;
  crowded: number;
  loud: number;
  vibe: typeof VIBE_OPTIONS[number];
  notes: string;
};

export interface CrowdPingFormProps {
  onSubmit: (values: CrowdPingFormValues) => Promise<void>;
  onReset?: () => void;
  defaultValues?: Partial<CrowdPingFormValues>;
  submitting?: boolean;
  error?: string | null;
}

const CROWD_MARKS = [
  { value: 0, label: "0" },
  { value: 3, label: "3" },
  { value: 6, label: "6" },
  { value: 8, label: "8" },
  { value: 10, label: "10" },
];

const CROWD_HINTS = [
  { range: "0–2", label: "Empty" },
  { range: "3–5", label: "Light" },
  { range: "6–7", label: "Busy" },
  { range: "8–10", label: "Packed" },
];

const LOUD_MARKS = [
  { value: 0, label: "0" },
  { value: 10, label: "10" },
];

export default function CrowdPingForm({
  onSubmit,
  onReset,
  defaultValues,
  submitting = false,
  error,
}: CrowdPingFormProps) {
  const [place, setPlace] = useState(defaultValues?.place ?? "");
  const [crowded, setCrowded] = useState(defaultValues?.crowded ?? 5);
  const [loud, setLoud] = useState(defaultValues?.loud ?? 4);
  const [vibe, setVibe] = useState<typeof VIBE_OPTIONS[number]>(defaultValues?.vibe ?? "Neutral");
  const [notes, setNotes] = useState(defaultValues?.notes ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const notesCount = notes.length;

  const crowdHelper = useMemo(
    () =>
      CROWD_HINTS.map((hint) => (
        <Chip
          key={hint.range}
          label={`${hint.range} ${hint.label}`}
          size="small"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
          }}
        />
      )),
    [],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const sanitizedPlace = sanitizeInput(place);
    const sanitizedNotes = sanitizeInput(notes);

    if (!sanitizedPlace) {
      setValidationError("Please share where you are on campus.");
      return;
    }

    if (
      Number.isNaN(crowded) ||
      Number.isNaN(loud) ||
      crowded < 0 ||
      crowded > 10 ||
      loud < 0 ||
      loud > 10
    ) {
      setValidationError("Crowd and loudness sliders must stay between 0 and 10.");
      return;
    }

    if (sanitizedNotes.length > 140) {
      setValidationError("Notes must be 140 characters or fewer.");
      return;
    }

    await onSubmit({
      place: sanitizedPlace,
      crowded: Math.round(crowded),
      loud: Math.round(loud),
      vibe,
      notes: sanitizedNotes,
    });
  };

  const handleReset = () => {
    setPlace("");
    setCrowded(5);
    setLoud(4);
    setVibe("Neutral");
    setNotes("");
    setValidationError(null);
    onReset?.();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={4}>
        <FormSection
          title="Where are you?"
          subtitle="Type a campus spot or pick from suggestions."
        >
          <Autocomplete
            freeSolo
            options={CAMPUS_SPOTS}
            value={place}
            onInputChange={(_, value) => setPlace(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Campus spot"
                required
                helperText="Examples: Evans Library, Southside Commons, MSC Flag Room"
              />
            )}
          />
        </FormSection>

        <FormSection title="How crowded does it feel?" subtitle="Move the slider to capture the vibe.">
          <Grid container rowSpacing={2} columnSpacing={2} alignItems="center">
            <Grid item xs={12}>
              <Slider
                value={crowded}
                onChange={(_, value) => setCrowded(value as number)}
                step={1}
                min={0}
                max={10}
                marks={CROWD_MARKS}
                valueLabelDisplay="auto"
                aria-labelledby="crowd-slider"
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {crowdHelper}
              </Stack>
            </Grid>
          </Grid>
        </FormSection>

        <FormSection title="How loud is it?" subtitle="0 is silent, 10 is very loud.">
          <Slider
            value={loud}
            onChange={(_, value) => setLoud(value as number)}
            step={1}
            min={0}
            max={10}
            marks={LOUD_MARKS}
            valueLabelDisplay="auto"
            aria-labelledby="loud-slider"
          />
        </FormSection>

        <FormSection title="What is the vibe like?" subtitle="Pick the best match right now.">
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={vibe}
              onChange={(event) => setVibe(event.target.value as typeof VIBE_OPTIONS[number])}
              aria-label="vibe"
            >
              {VIBE_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio color="primary" />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </FormSection>

        <FormSection title="Anything else?" subtitle="Optional notes. Keep it short and friendly.">
          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={(event) => setNotes(event.target.value.slice(0, 140))}
            multiline
            minRows={3}
            helperText={`${notesCount}/140 characters`}
          />
        </FormSection>
      </Stack>

      {(validationError || error) && (
        <FormHelperText error sx={{ mt: 3 }}>
          {validationError ?? error}
        </FormHelperText>
      )}

      <Divider sx={{ my: 3, borderColor: (theme) => alpha(theme.palette.primary.main, 0.08) }} />

      <CardActions sx={{ px: 0, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Times shown in CT (America/Chicago)
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="text" color="primary" onClick={handleReset} disabled={submitting}>
            Reset
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={submitting} sx={{ borderRadius: 3 }}>
            {submitting ? "Sending..." : "Submit ping"}
          </Button>
        </Stack>
      </CardActions>
    </Box>
  );
}
