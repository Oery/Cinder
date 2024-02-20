import { useTranslation } from "react-i18next";
import { useDisks } from "../hooks/useDisks";
import { Disk } from "../types/types";
import SideFolder from "./SideFolder";
import "../styles/sidebar.sass";

const pinned = [
    "C:/Users/Oery/Documents/Code OSEF",
    "C:/Users/Oery/Documents/GitHub",
    "C:/Users/Oery/Documents/GitHub/Cinder",
];

const main = {
    Home: "cinder:home",
    Pictures: "C:/Users/Oery/Pictures",
    Videos: "C:/Users/Oery/Videos",
    Music: "C:/Users/Oery/Music",
    Downloads: "C:/Users/Oery/Downloads",
    "This PC": "cinder:disks",
};

export default function Sidebar() {
    const { disks } = useDisks();
    const { t } = useTranslation();

    return (
        <aside data-tauri-drag-region className="sidebar">
            <section>
                {Object.entries(main).map(([name, path]) => (
                    <SideFolder key={name} name={name} path={path} />
                ))}
            </section>
            <section>
                {pinned.map((path) => (
                    <SideFolder
                        key={path}
                        name={path.split("/").pop() as string}
                        path={path}
                    />
                ))}
            </section>
            <section>
                {disks.map((disk: Disk) => (
                    <SideFolder
                        key={disk.name}
                        name={`${
                            disk.name || t("USB Drive")
                        } (${disk.mount_point.slice(0, 2)})`}
                        path={disk.mount_point.replace(/\\/g, "/")}
                    />
                ))}
            </section>
        </aside>
    );
}
