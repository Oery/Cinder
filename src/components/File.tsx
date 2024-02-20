// import { useState } from "react";
import { useKeys } from "../hooks/useKeys";
import { useSelection } from "../hooks/useSelection";
import { Item } from "../types/types";

interface FileProps {
    file: Item;
}
export function File({ file }: FileProps) {
    const { ctrlKey } = useKeys();
    const { setSelection, selection } = useSelection();
    // const [timeSinceLastClick, setTimeSinceLastClick] = useState(0);

    return (
        <div
            className={`file ${file.extension}`}
            onClick={() => {
                // const now = Date.now();
                // if (now - timeSinceLastClick < 300) {
                //     // open file
                // }

                if (!ctrlKey) {
                    setSelection([file.name]);
                    return;
                }

                if (selection.includes(file.name)) {
                    setSelection(
                        selection.filter((name) => name !== file.name)
                    );
                } else {
                    setSelection([...selection, file.name]);
                }
            }}
        >
            {file.name}
        </div>
    );
}
