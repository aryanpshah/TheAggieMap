"use client";

import { SignIn } from "@clerk/nextjs";
import Box from "@mui/material/Box";

export default function SignInPage() {
  return (
    <Box sx={{ py: 12, display: "flex", justifyContent: "center" }}>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </Box>
  );
}
