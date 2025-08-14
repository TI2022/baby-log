'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import { RecordsProvider } from "@/contexts/RecordsContext";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import StyledComponentsRegistry from "@/lib/registry";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <RecordsProvider>
            {children}
          </RecordsProvider>
        </AuthProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}