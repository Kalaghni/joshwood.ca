"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type BackgroundToggleValue = {
    enabled: boolean;
    toggle: () => void;
};

const BackgroundToggleContext = createContext<BackgroundToggleValue>({
    enabled: false,
    toggle: () => {},
});

export function BackgroundToggleProvider({ children }: { children: ReactNode }) {
    const [enabled, setEnabled] = useState(false);
    return (
        <BackgroundToggleContext.Provider
            value={{ enabled, toggle: () => setEnabled((v) => !v) }}
        >
            {children}
        </BackgroundToggleContext.Provider>
    );
}

export function useBackgroundToggle() {
    return useContext(BackgroundToggleContext);
}
