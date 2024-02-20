import {
    Download,
    Film,
    Headphones,
    Home,
    Laptop,
    Image,
    Folder,
    HardDrive,
    User,
} from "lucide-react";

function isUserFolder(folder: string) {
    return folder.startsWith("C:/Users/") && folder.split("/").length === 3;
}

export function getIcon(path: string, size: number): JSX.Element {
    if (isUserFolder(path)) return <User size={size} />;
    const folder = path.split("/").pop() as string;
    // if (isDrive(path)) return <HardDrive size={size} />;
    if (path.endsWith(":/") || path.endsWith(":)"))
        return <HardDrive size={size} />;

    const iconMap: { [key: string]: JSX.Element } = {
        Home: <Home size={size} />,
        Videos: <Film size={size} />,
        Pictures: <Image size={size} />,
        Music: <Headphones size={size} />,
        Downloads: <Download size={size} />,
        "This PC": <Laptop size={size} />,
        "cinder:disks": <Laptop size={size} />,
        "cinder:home": <Home size={size} />,
    };

    return iconMap[folder] || <Folder size={size} />;
}
