import { Maximize2, Minus, X } from "lucide-react";
import { appWindow } from "@tauri-apps/api/window";
import "../styles/window-controls.sass";

export default function WindowControls() {
    return (
        <div className="window-controls" data-tauri-drag-region>
            <button className="icon-btn" onClick={() => appWindow.minimize()}>
                <Minus />
            </button>
            <button
                className="icon-btn"
                onClick={() => appWindow.toggleMaximize()}
            >
                <Maximize2 />
            </button>
            <button className="icon-btn" onClick={() => appWindow.close()}>
                <X />
            </button>
        </div>
    );
}
