import { LayoutGrid, LayoutList } from "lucide-react";
import { useView } from "../hooks/useView";
import "../styles/view-toggle.sass";

export default function ViewToggle() {
    const { setView, view } = useView();

    return (
        <div className="view-toggle">
            <button
                onClick={() => setView("list")}
                className={"icon-btn " + (view === "list" ? "active-view" : "")}
            >
                <LayoutList />
            </button>
            <button
                onClick={() => setView("grid")}
                className={"icon-btn " + (view === "grid" ? "active-view" : "")}
            >
                <LayoutGrid />
            </button>
        </div>
    );
}
