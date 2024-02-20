import { useEffect } from "react";
import { usePath } from "../hooks/usePath";
import { sortByExtension } from "../utils/fileSort";
import { useSelection } from "../hooks/useSelection";
import FilesGridItem from "./FilesGridItem";
import { useView } from "../hooks/useView";
import "../styles/files-grid.sass";

export default function FilesGrid() {
    const { path, files } = usePath();
    const { view } = useView();

    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        isSelecting,
        selectionStyle,
        setSelection,
    } = useSelection();

    useEffect(() => {
        setSelection([]);
    }, [path]);

    return (
        <div
            className={`files-grid ${view}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            {isSelecting && (
                <div className="selection" style={selectionStyle} />
            )}
            {sortByExtension(files).map((item) => (
                <FilesGridItem key={item.name} item={item} />
            ))}
        </div>
    );
}
