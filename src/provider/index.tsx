"use client";

import { useRef } from "react";
import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import ClickSpark from "@/components/global/cursor-sparklin";
import Spinner from "@/components/ui/spinner";
import { Provider as ReduxProvider } from "react-redux";
import { store, AppStore } from "@/lib/store/";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { SessionProvider } from "next-auth/react";

interface ProviderProps extends ThemeProviderProps {
  session: any;
}

export const Provider = ({ children, session, ...props }: ProviderProps) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = store();
  }

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      enableSystem={true}
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <Toaster
        icons={{ loading: <Spinner size="sm" color="secondary" /> }}
        invert={true}
        theme="system"
        position="bottom-right"
      />
      <ClickSpark />
      <SessionProvider session={session}  refetchOnWindowFocus={false}>
        <ReduxProvider store={storeRef.current}>
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </ReduxProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
};

export default Provider;
