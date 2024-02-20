import { Item } from "../types/types";

export const sortFiles = (files: Item[]): Item[] => {
    files.sort((a, b) => {
        if (a._type === "Directory" && b._type === "File") return -1;
        if (a._type === "File" && b._type === "Directory") return 1;
        return a.name.localeCompare(b.name);
    });
    return sortByExtension(files);
};

export const sortByExtension = (files: Item[]): Item[] => {
    const directories = files.filter((file) => file._type === "Directory");
    const otherFiles = files.filter((file) => file._type === "File");
    otherFiles.sort((a, b) => {
        if (a.extension === b.extension) {
            return a.name.localeCompare(b.name);
        }
        return a.extension.localeCompare(b.extension);
    });

    return [...directories, ...otherFiles];
};

// const sortByName = (files: Item[]) => {
//     return files.sort((a, b) => {
//         if (a._type === "Directory" && b._type === "File") return -1;
//         if (a._type === "File" && b._type === "Directory") return 1;
//         return a.name.localeCompare(b.name);
//     });
// };

// const sortFiles = (files: Item[]) => {
//     const directories = files.filter((file) => file._type === "Directory");
//     // sort other files by extension then by name
//     const otherFiles = files.filter((file) => file._type === "File");

//     return [...directories, ...otherFiles];
// };
