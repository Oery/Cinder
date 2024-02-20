const diskSize = {
    B: 1,
    KB: 1_000,
    MB: 1_000_000,
    GB: 1_000_000_000,
    TB: 1_000_000_000_000,
    PB: 1_000_000_000_000_000,
};

export function getDiskSize(size: number) {
    let unit = "B";
    for (const [key, value] of Object.entries(diskSize)) {
        if (size < value) {
            break;
        }
        unit = key;
    }
    return unit;
}
