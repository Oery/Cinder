import { useTranslation } from "react-i18next";
import { usePath } from "../hooks/usePath";
import { useTab } from "../hooks/useTab";
import { getIcon } from "../utils/icon";

interface SideFolderProps {
    name: string;
    path: string;
}

export default function SideFolder({ name, path }: SideFolderProps) {
    const { t } = useTranslation();
    const { navigate } = usePath();
    const { openTab } = useTab();

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1) {
            openTab(path, false);
            e.preventDefault();
        }
    };

    return (
        <div onClick={() => navigate(path)} onMouseDown={handleMouseDown}>
            {getIcon(name, 18)}
            <h3>{t(name)}</h3>
        </div>
    );
}
