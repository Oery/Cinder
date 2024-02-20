import { Plus } from "lucide-react";
import { useTab } from "../hooks/useTab";
import { Reorder } from "framer-motion";
import Tab from "./Tab";
import "../styles/tab-manager.sass";

export default function TabManager() {
    const { tabs, openTab, setTabs } = useTab();

    const handleWheel = (e: React.WheelEvent) => {
        const container = e.currentTarget as HTMLUListElement;
        const scrollSpeed = 0.5;
        container.scrollLeft += e.deltaY * scrollSpeed;
    };

    const shouldAnimPlus = () => {
        return tabs.some((tab) => Date.now() - tab.createdAt < 500);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const text = e.dataTransfer.getData("text");
        openTab(text, true);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    return (
        <nav>
            <Reorder.Group
                axis="x"
                values={tabs}
                onReorder={setTabs}
                className="tab-manager"
                as="ul"
                onWheel={handleWheel}
                data-tauri-drag-region
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {tabs.map((tab) => (
                    <Tab tab={tab} key={tab.id} />
                ))}
                <li className="new-tab-btn">
                    <button
                        className={
                            shouldAnimPlus()
                                ? "plus-anim-right icon-btn"
                                : "icon-btn"
                        }
                        onClick={() => openTab("cinder:disks", true)}
                    >
                        <Plus size={24} />
                    </button>
                </li>
            </Reorder.Group>
        </nav>
    );
}
