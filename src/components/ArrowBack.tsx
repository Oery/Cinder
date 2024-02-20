import { ArrowUp } from "lucide-react";
import { usePath } from "../hooks/usePath";

export default function ArrowBack() {
    const { goBack } = usePath();

    return (
        <button onClick={goBack} className="icon-btn">
            <ArrowUp />
        </button>
    );
}
