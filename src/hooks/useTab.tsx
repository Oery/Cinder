import { createContext, useContext, useEffect, useState } from "react";
import { Tab } from "../types/types";
import { usePath } from "./usePath";
import { isDrive } from "../utils/pathTypes";
import { appWindow } from "@tauri-apps/api/window";
import { useTranslation } from "react-i18next";
import { useDisks } from "./useDisks";

const TabContext = createContext(
    {} as {
        tabs: Tab[];
        setTabs: (tabs: Tab[]) => void;
        activeTab: string;
        setActiveTab: (id: string) => void;
        openTab: (path: string, setActive: boolean) => void;
        closeTab: (id: string) => void;
    }
);

// const DiskMap: { [key: string]: string } = {
//     "C:/": "SSD NvME (C:)",
//     "D:/": "DATA (D:)",
//     "E:/": "Ancien SSD (E:)",
//     "F:/": "Elements (F:)",
// };

export const useTab = () => useContext(TabContext);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
    const [tabs, setTabs] = useState<Tab[]>([
        {
            name: "My Documents",
            path: "C:/Users/Oery/Documents",
            id: Math.random().toString(),
            createdAt: Date.now(),
        },
    ]);
    const [activeTab, setActiveTab] = useState(tabs[0].id || "");
    const { navigate, path } = usePath();
    const { t } = useTranslation();
    const { disks } = useDisks();

    const DiskMap: { [key: string]: string } = disks.reduce(
        (acc, disk) => ({
            ...acc,
            [disk.mount_point.replace("\\", "/")]: `${
                disk.name || t("USB Drive")
            } (${disk.mount_point.slice(0, 2)})`,
        }),
        {}
    );

    useEffect(() => {
        let newPath = path;
        if (newPath.endsWith("/")) {
            newPath = newPath.slice(0, -1);
        }

        setTabs(
            tabs.map((tab) =>
                tab.id === activeTab
                    ? {
                          name:
                              DiskMap[path] || newPath.split("/").pop() || path,
                          path,
                          id: activeTab,
                          createdAt: tab.createdAt,
                      }
                    : tab
            )
        );
    }, [path]);

    const openTab = (path: string, setActive: boolean) => {
        console.log(path);
        let newPath = path;
        if (newPath.endsWith("/") && !isDrive(newPath)) {
            newPath = newPath.slice(0, -1);
            console.log(newPath);
        }

        const newTab = {
            name: newPath.split("/").pop() || DiskMap[path] || path,
            path: path,
            id: Math.random().toString(),
            createdAt: Date.now(),
        };

        setTabs([...tabs, newTab]);
        if (setActive) {
            setActiveTab(newTab.id);
            navigate(path);
        }
    };

    const closeTab = (id: string) => {
        const tabIndex = tabs.findIndex((tab) => tab.id === id);
        setTabs(tabs.filter((tab) => tab.id !== id));

        if (activeTab === id) {
            const newActiveTab =
                tabs[tabIndex - 1] || tabs[tabIndex + 1] || null;
            if (newActiveTab) {
                setActiveTab(newActiveTab.id);
                navigate(newActiveTab.path);
                return;
            }

            console.log("no active tab");

            // close window

            appWindow.close().catch((err) => {
                console.error("Error closing window:", err);
            });

            // setActiveTab(id);

            // let newPath = tabs[tabIndex].path;
            // if (newPath.endsWith("/")) {
            //     newPath = newPath.slice(0, -1);
            // }

            // setTabs(
            //     tabs.map((tab) =>
            //         tab.id === activeTab
            //             ? {
            //                   name:
            //                       DiskMap[path] ||
            //                       newPath.split("/").pop() ||
            //                       path,
            //                   path,
            //                   id: activeTab,
            //                   createdAt: tab.createdAt,
            //               }
            //             : tab
            //     )
            // );
        }
    };

    return (
        <TabContext.Provider
            value={{
                tabs,
                setTabs,
                activeTab,
                setActiveTab,
                openTab,
                closeTab,
            }}
        >
            {children}
        </TabContext.Provider>
    );
};
