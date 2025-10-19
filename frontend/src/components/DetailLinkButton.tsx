"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

type DetailLinkButtonProps = {
  id: string;
  label?: string;
  size?: "small" | "medium" | "large";
  onClickCapture?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
};

export function DetailLinkButton({
  id,
  label = "Details",
  size = "medium",
  onClickCapture,
  ariaLabel,
}: DetailLinkButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      color="primary"
      size={size}
      onClick={(event) => {
        onClickCapture?.(event);
        router.push(`/details/${encodeURIComponent(id)}`);
      }}
      aria-label={ariaLabel ?? `Open details for ${id}`}
    >
      {label}
    </Button>
  );
}
