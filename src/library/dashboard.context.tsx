'use client'

import { createContext, useContext, useState } from "react";

interface IDashboardContext {
    collapseMenu: boolean;
    setCollapseMenu: (v: boolean) => void;
}

export const DashboardContext = createContext<IDashboardContext | null>(null);

export const DashboardContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [collapseMenu, setCollapseMenu] = useState(false);

    return (
        <DashboardContext.Provider value={{ collapseMenu, setCollapseMenu }}>
            {children}
        </DashboardContext.Provider>
    )
};

export const useDashboardContext = () => useContext(DashboardContext);