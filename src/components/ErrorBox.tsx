import { useEffect } from "react";
import "../styles/error-box.sass";

interface ErrorBoxProps {
    error: string;
    close: () => void;
}

export default function ErrorBox({ error, close }: ErrorBoxProps) {
    const handleClick = () => {
        const errorBox = document.querySelector(".error-box");
        errorBox?.classList.add("hidden");
        setTimeout(() => {
            close();
        }, 300);
    };

    useEffect(() => {
        setTimeout(() => {
            const errorBox = document.querySelector(".error-box");
            if (errorBox) {
                errorBox.classList.remove("hidden");
            }
        }, 100);
    }, []);

    return (
        <div className="error-box hidden" data-tauri-drag-region>
            <div className="container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={handleClick}>Close</button>
            </div>
        </div>
    );
}
