import { createContext, useContext, useEffect, useState } from "react";
import { Disk } from "../types/types";
import { invoke } from "@tauri-apps/api";

const DisksContext = createContext(
    {} as {
        disks: Disk[];
    }
);

export const useDisks = () => useContext(DisksContext);

export const DisksProvider = ({ children }: { children: React.ReactNode }) => {
    const [disks, setDisks] = useState<Disk[]>([]);

    useEffect(() => {
        invoke("get_disks").then((response) => {
            console.log(response);
            setDisks(response as Disk[]);
        });
    }, []);

    return (
        <DisksContext.Provider value={{ disks }}>
            {children}
        </DisksContext.Provider>
    );
};
