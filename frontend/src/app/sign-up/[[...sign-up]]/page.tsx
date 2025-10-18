"use client";

import { SignUp } from "@clerk/nextjs";
import Box from "@mui/material/Box";

export default function SignUpPage() {
  return (
    <Box sx={{ py: 12, display: "flex", justifyContent: "center" }}>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </Box>
  );
}
