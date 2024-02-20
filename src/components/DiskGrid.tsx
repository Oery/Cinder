import { Disk } from "../types/types";
import { HardDrive } from "lucide-react";
import { useTab } from "../hooks/useTab";
import { useDisks } from "../hooks/useDisks";
import { usePath } from "../hooks/usePath";
import { getDiskSize } from "../utils/disk";
import { useView } from "../hooks/useView";
import { useTranslation } from "react-i18next";
import "../styles/disks-grid.sass";

function DiskItem({ disk }: { disk: Disk }) {
    const { openTab } = useTab();
    const { navigate } = usePath();
    const { t } = useTranslation();

    const total = disk.size / 1_000_000_000;
    let roundedTotal = Math.round(total);

    if (roundedTotal >= 1_000) {
        roundedTotal = Math.round(total / 1_000);
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1) {
            openTab(disk.mount_point.slice(0, 2) + "/", false);
        }
    };

    const handleClick = () => {
        navigate(disk.mount_point.slice(0, 2) + "/");
    };

    return (
        <div
            className="disk"
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            <header>
                <HardDrive />
                {`${disk.name || t("USB Drive")} (${disk.mount_point.slice(
                    0,
                    2
                )})`}
                <div className="disk-size">{`${roundedTotal}${getDiskSize(
                    disk.size
                )}`}</div>
            </header>

            <div className="disk-bar">
                <div
                    className="disk-free"
                    style={{
                        width: `${100 - (disk.free / disk.size) * 100}%`,
                    }}
                ></div>
            </div>
        </div>
    );
}

export default function DiskGrid() {
    const { disks } = useDisks();
    const { view } = useView();

    return (
        <div className={"disks-grid " + view}>
            {disks
                .sort((a, b) => {
                    if (a.mount_point < b.mount_point) return -1;
                    if (a.mount_point > b.mount_point) return 1;
                    return 0;
                })
                .map((disk) => (
                    <DiskItem key={disk.mount_point} disk={disk} />
                ))}
        </div>
    );
}
