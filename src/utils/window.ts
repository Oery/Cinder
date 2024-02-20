import { invoke } from "@tauri-apps/api";
import { WebviewWindow } from "@tauri-apps/api/window";

export function createWindow(path: string) {
    const label = Math.random().toString().replace(".", "");

    const webview = new WebviewWindow(label, {
        url: `index.html?path=${path}`,
        title: "Cinder",
        titleBarStyle: "overlay",
        hiddenTitle: true,
        decorations: false,
        fullscreen: false,
        resizable: true,
        width: 950,
        height: 600,
        transparent: true,
        center: true,
        focus: true,
        fileDropEnabled: false,
    });

    webview.once("tauri://created", function () {
        invoke("apply_window_settings", { label });
    });
}
