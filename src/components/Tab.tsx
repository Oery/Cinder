import { Reorder } from "framer-motion";
import { X } from "lucide-react";
import { getIcon } from "../utils/icon";
import { useTranslation } from "react-i18next";
import { useTab } from "../hooks/useTab";
import type { Tab } from "../types/types";
import { usePath } from "../hooks/usePath";
import { createWindow } from "../utils/window";
import "../styles/tab.sass";

const nameMap: {
    [key: string]: string;
} = {
    "cinder:disks": "This PC",
    "cinder:home": "Home",
};

export default function Tab({ tab }: { tab: Tab }) {
    const { t } = useTranslation();
    const { closeTab, activeTab, setActiveTab, tabs } = useTab();
    const { navigate } = usePath();

    const handleTabClick = (tab: Tab) => {
        if (tab.id === activeTab) return;
        navigate(tab.path);
        setActiveTab(tab.id);
    };

    const handleMiddleClick = (e: React.MouseEvent, id: string) => {
        if (e.button === 1) {
            closeTab(id);
            e.preventDefault();
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("text", tab.path);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const view = e.view as any;
        const click = { x: e.screenX, y: e.screenY };
        const windowLocation = { x: view.screenX, y: view.screenY };
        const windowSize = { x: view.outerWidth, y: view.outerHeight };

        const isClickInsideWindow =
            click.x >= windowLocation.x &&
            click.x <= windowLocation.x + windowSize.x &&
            click.y >= windowLocation.y &&
            click.y <= windowLocation.y + windowSize.y;

        if (e.dataTransfer.dropEffect === "move") {
            closeTab(tab.id);
        }

        if (
            !isClickInsideWindow &&
            tabs.length > 1 &&
            e.dataTransfer.dropEffect === "none"
        ) {
            closeTab(tab.id);
            createWindow(tab.path);
        }

        e.dataTransfer.clearData();
    };

    return (
        <Reorder.Item
            key={tab.id}
            value={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div
                onClick={() => handleTabClick(tab)}
                onMouseDown={(e) => handleMiddleClick(e, tab.id)}
                className={`${activeTab === tab.id ? "tab active" : "tab"}`}
                draggable={true}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseMove={handleMouseMove}
            >
                {getIcon(tab.path, 24)}
                <p>{t(nameMap[tab.name]) || t(tab.name) || t("USB Drive")}</p>
                <X size={18} onClick={() => closeTab(tab.id)} />
            </div>
        </Reorder.Item>
    );
}
