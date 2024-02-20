import { useRef, useState } from "react";
import { usePath } from "../hooks/usePath";
import { Item } from "../types/types";
import { useSelection } from "../hooks/useSelection";
import { useTab } from "../hooks/useTab";

interface FilesGridItemProps {
    item: Item;
}

export default function FilesGridItem({ item }: FilesGridItemProps) {
    const [timeSinceLastClick, setTimeSinceLastClick] = useState(0);
    const { navigate, path } = usePath();
    const { openTab } = useTab();
    const { select, isSelected, handleKeyDown } = useSelection();
    const itemRef = useRef(null); // Ref to access the DOM element

    const hideFileExtension = true;

    let className =
        item._type === "Directory" ? "directory" : "file " + item.extension;

    className += isSelected(item.name) ? " selected" : "";

    const open = () => {
        switch (item._type) {
            case "Directory":
                navigate("/" + item.name);
                break;
            case "File":
                // TODO: open file using command
                break;
        }
    };

    const handleClick = () => {
        console.log("click");
        const now = Date.now();
        select(item.name);
        // if (!isSelected(item.name)) {
        //     select(item.name);
        // }

        if (now - timeSinceLastClick < 300) {
            open();
            setTimeSinceLastClick(0);
        }
        setTimeSinceLastClick(now);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 && item._type === "Directory") {
            openTab(path + "/" + item.name, false);
            e.preventDefault();
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        console.log("Drag started");
        e.dataTransfer.setData("text", item.name);
    };

    const handleDragEnd = () => {
        console.log("Drag operation finished");
    };

    return (
        <div
            draggable={true}
            ref={itemRef}
            className={className}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onKeyDown={handleKeyDown}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {hideFileExtension &&
            item._type === "File" &&
            !item.name.startsWith(".")
                ? item.name.split(".")[0]
                : item.name}
        </div>
    );
}
