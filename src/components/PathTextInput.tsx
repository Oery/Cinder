import React, { useEffect, useState } from "react";
import { usePath } from "../hooks/usePath";

export default function PathTextInput() {
    const { path, tryNavigate } = usePath();
    const [input, setInput] = useState(path);

    useEffect(() => {
        setInput(path);
    }, [path]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        tryNavigate(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            tryNavigate(input);
        }
    };

    return (
        <input
            type="text"
            spellCheck="false"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    );
}
