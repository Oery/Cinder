interface Item {
    name: string;
    _type: "File" | "Directory";
    extension: string;
    hidden?: true;
}

interface Tab {
    name: string;
    path: string;
    id: string;
    createdAt: number;
}

interface Disk {
    name: string;
    mount_point: string;
    size: number;
    free: number;
    kind: string;
}

type View = "grid" | "list";

export { Item, View, Tab, Disk };
