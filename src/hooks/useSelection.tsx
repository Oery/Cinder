import { createContext, useContext, useState } from "react";
import { usePath } from "./usePath";
import { useKeys } from "./useKeys";
import { sortByExtension } from "../utils/fileSort";

const SelectionContext = createContext(
    {} as {
        checkCollision: (
            fileName: string,
            originX: number,
            originY: number,
            height: number,
            width: number
        ) => boolean;
        handleMouseDown: (e: React.MouseEvent) => void;
        handleMouseMove: (e: React.MouseEvent) => void;
        handleMouseUp: () => void;
        handleKeyDown: (e: React.KeyboardEvent) => void;
        isSelecting: boolean;
        selection: string[];
        selectionStyle: React.CSSProperties;
        setSelection: React.Dispatch<React.SetStateAction<string[]>>;
        isSelected: (fileName: string) => boolean;
        select: (fileName: string) => void;
        endPoint: { x: number; y: number };
    }
);

export const useSelection = () => useContext(SelectionContext);

export const SelectionProvider = ({ children }: any) => {
    const { files } = usePath();
    const { ctrlKey, shiftKey } = useKeys();

    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
    const [isSelecting, setIsSelecting] = useState(false);
    const [selection, setSelection] = useState<string[]>([]);
    const [lastElementSelected, setLastElementSelected] = useState("");

    const checkCollision = (
        fileName: string,
        originX: number,
        originY: number,
        height: number,
        width: number
    ) => {
        const rect1 = {
            left: Math.min(startPoint.x, endPoint.x),
            top: Math.min(startPoint.y, endPoint.y),
            width: Math.abs(startPoint.x - endPoint.x),
            height: Math.abs(startPoint.y - endPoint.y),
        };
        const rect2 = {
            left: originX,
            top: originY,
            width,
            height,
        };

        if (
            rect1.left < rect2.left + rect2.width &&
            rect1.left + rect1.width > rect2.left &&
            rect1.top < rect2.top + rect2.height &&
            rect1.top + rect1.height > rect2.top
        ) {
            setSelection([...selection, fileName]);
            return true;
        }
        return false;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartPoint({ x: e.clientX, y: e.clientY });
        setEndPoint({ x: e.clientX, y: e.clientY });
        setIsSelecting(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isSelecting) return;
        // only update values that are in bounds of the file grid
        // TODO: fix this

        setEndPoint({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        console.log(e.key);
        e.preventDefault();

        if (e.key === "Escape") {
            setSelection([]);
        }

        if (e.key === "ArrowDown") {
            // get index of lastElementSelected then set selection to the next item
            const sortedFiles = sortByExtension(files);
            const lastIndex = sortedFiles.findIndex(
                (file) => file.name === lastElementSelected
            );
            if (lastIndex === -1) return;
            const nextIndex = lastIndex + 1;
            if (nextIndex >= sortedFiles.length) return;
            setSelection([sortedFiles[nextIndex].name]);
            setLastElementSelected(sortedFiles[nextIndex].name);
        }
    };

    const selectionStyle = {
        display: isSelecting ? "block" : "none",
        left: Math.min(startPoint.x, endPoint.x),
        top: Math.min(startPoint.y, endPoint.y),
        width: Math.abs(startPoint.x - endPoint.x),
        height: Math.abs(startPoint.y - endPoint.y),
    };

    const isSelected = (fileName: string) => selection.includes(fileName);

    const select = (fileName: string) => {
        if (!ctrlKey && !shiftKey) {
            setSelection([fileName]);
            setLastElementSelected(fileName);
        } else if (ctrlKey) {
            if (selection.includes(fileName)) {
                setSelection(selection.filter((name) => name !== fileName));
            } else {
                setSelection([...selection, fileName]);
                setLastElementSelected(fileName);
            }
        } else if (shiftKey) {
            const sortedFiles = sortByExtension(files);
            const lastSelectedIndex = sortedFiles.findIndex(
                (file) => file.name === lastElementSelected
            );
            const currentIndex = sortedFiles.findIndex(
                (file) => file.name === fileName
            );
            const newSelection = sortedFiles
                .slice(
                    Math.min(lastSelectedIndex, currentIndex),
                    Math.max(lastSelectedIndex, currentIndex) + 1
                )
                .map((file) => file.name);
            setSelection(newSelection);
        }
    };

    return (
        <SelectionContext.Provider
            value={{
                selection,
                handleMouseDown,
                handleMouseMove,
                handleMouseUp,
                handleKeyDown,
                checkCollision,
                isSelecting,
                selectionStyle,
                setSelection,
                isSelected,
                select,
                endPoint,
            }}
        >
            {children}
        </SelectionContext.Provider>
    );
};
