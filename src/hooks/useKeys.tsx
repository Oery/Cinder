import { createContext, useContext, useEffect, useState } from "react";

const KeysContext = createContext(
    {} as {
        ctrlKey: boolean;
        shiftKey: boolean;
    }
);

export const useKeys = () => useContext(KeysContext);

export const KeysProvider = ({ children }: { children: React.ReactNode }) => {
    const [ctrlKey, setCtrlKey] = useState(false);
    const [shiftKey, setShiftKey] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Control":
                    setCtrlKey(true);
                    break;
                case "Shift":
                    setShiftKey(true);
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Control":
                    setCtrlKey(false);
                    break;
                case "Shift":
                    setShiftKey(false);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <KeysContext.Provider value={{ ctrlKey, shiftKey }}>
            {children}
        </KeysContext.Provider>
    );
};
