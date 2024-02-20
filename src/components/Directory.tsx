import { useState } from "react";
import { usePath } from "../hooks/usePath";
import { useSelection } from "../hooks/useSelection";

interface DirectoryProps {
    name: string;
}

export function Directory({ name }: DirectoryProps) {
    const { navigate } = usePath();
    const { select, isSelected } = useSelection();
    const [timeSinceLastClick, setTimeSinceLastClick] = useState(0);

    const handleClick = () => {
        select(name);
        const now = Date.now();
        if (now - timeSinceLastClick < 500) {
            setTimeSinceLastClick(0);
            navigate(name + "\\");
        } else {
            setTimeSinceLastClick(now);
        }
    };

    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
            onClick={handleClick}
            className={`directory ${isSelected(name) ? "selected" : ""}`}
            key={name}
        >
            {name}
        </div>
    );
}
