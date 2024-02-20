import { createContext, useContext, useState } from "react";

type View = "list" | "grid";

const ViewContext = createContext(
    {} as {
        view: View;
        setView: (view: View) => void;
    }
);

export const useView = () => useContext(ViewContext);

export const ViewProvider = ({ children }: any) => {
    const [view, setView] = useState<View>("list");

    return (
        <ViewContext.Provider
            value={{
                view,
                setView,
            }}
        >
            {children}
        </ViewContext.Provider>
    );
};
