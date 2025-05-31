"use client";

import { useEffect, useRef } from "react";
import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import ClickSpark from "@/components/global/cursor-sparklin";
import { useAuthUser } from "@/hooks/use-auth-user";
import Spinner from "@/components/ui/spinner";
import { Provider as ReduxProvider } from "react-redux";
import { store, AppStore } from "@/lib/store/";

export const Provider = ({ children, ...props }: ThemeProviderProps) => {
    const { expire, signOut } = useAuthUser();

    useEffect(() => {
        const currentTime = new Date().getTime();
        const expireTime = new Date(expire || "").getTime();

        if (expire && expireTime < currentTime) {
            signOut({ callbackUrl: "/auth/login" });
        }
    }, [expire, signOut]);

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
            <ReduxProvider store={storeRef.current}>
                {children}
            </ReduxProvider>
        </NextThemesProvider>
    );
};

export default Provider;
