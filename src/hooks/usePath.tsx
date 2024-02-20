import { createContext, useContext, useEffect, useState } from "react";
import { Item } from "../types/types";
import { invoke } from "@tauri-apps/api";
import DiskGrid from "../components/DiskGrid";
import FilesGrid from "../components/FilesGrid";

const PathContext = createContext(
    {} as {
        navigate: (toPath: string) => void;
        tryNavigate: (toPath: string) => void;
        goBack: () => void;
        path: string;
        files: Item[];
        error: string | null;
        resetError: () => void;
    }
);

function HomeLayout() {
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}

export const usePath = () => useContext(PathContext);

const customPaths: Record<string, JSX.Element> = {
    "cinder:disks": <DiskGrid />,
    "cinder:home": <HomeLayout />,
};

export const isCustomPath = (path: string) => {
    return customPaths[path] !== undefined;
};

export const getLayout = (path: string) => {
    return customPaths[path] || <FilesGrid />;
};

export const PathProvider = ({ children }: { children: React.ReactNode }) => {
    const [path, setPath] = useState("cinder:disks");
    const [files, setFiles] = useState<Item[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const pathParameter = window.location.search.split("path=")[1]; // if new window -> go to path
        if (pathParameter) navigate(pathParameter);
        if (isCustomPath(path)) return; // if path is custom (like cinder:disks) -> return
        getFiles(path);
    }, []);

    useEffect(() => {
        setError(null);
    }, [path]);

    const getFiles = (path: string) => {
        setError(null);
        invoke("get_files", { path })
            .then((files) => {
                setFiles(files as Item[]);
                setPath(path);
            })
            .catch((error) => {
                setError(error);
                console.error(error);
            });
    };

    const tryGetFiles = (path: string) => {
        invoke("get_files", { path }).then((files) => {
            setFiles(files as Item[]);
            setPath(path);
        });
    };

    const tryNavigate = (toPath: string) => {
        if (isCustomPath(toPath)) {
            setPath(toPath);
            return;
        }

        const newPath = toPath.startsWith("/")
            ? path + "/" + toPath.slice(1)
            : toPath;
        tryGetFiles(newPath);
    };

    const navigate = (toPath: string) => {
        if (isCustomPath(toPath)) {
            setPath(toPath);
            return;
        }

        const newPath = toPath.startsWith("/")
            ? path + "/" + toPath.slice(1)
            : toPath;
        getFiles(newPath.replace("//", "/"));
    };

    const goBack = () => {
        if (!path || isCustomPath(path)) return;
        let newPath = path.split("/").slice(0, -1).join("/");

        if (newPath.length === 2) {
            newPath += "/";
        }

        if (newPath === path) {
            navigate("cinder:disks");
            return;
        }
        getFiles(newPath);
    };

    const resetError = () => {
        setError(null);
    };

    return (
        <PathContext.Provider
            value={{
                navigate,
                goBack,
                path,
                files,
                error,
                resetError,
                tryNavigate,
            }}
        >
            {children}
        </PathContext.Provider>
    );
};
