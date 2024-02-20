import ReactDOM from "react-dom/client";
// import "./styles.css";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { PathProvider } from "./hooks/usePath";
import { KeysProvider } from "./hooks/useKeys";
import { TabProvider } from "./hooks/useTab";
import { SelectionProvider } from "./hooks/useSelection";
import { DisksProvider } from "./hooks/useDisks";
import Cinder from "./Cinder";

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            fr: {
                translation: {
                    "This PC": "Ce PC",
                    Documents: "Documents",
                    Home: "Accueil",
                    Pictures: "Images",
                    Videos: "Vidéos",
                    Music: "Musique",
                    Downloads: "Téléchargements",
                    Favorites: "Favoris",
                    Error: "Erreur",
                    "USB Drive": "Clé USB",
                },
            },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <PathProvider>
        <KeysProvider>
            <DisksProvider>
                <TabProvider>
                    <SelectionProvider>
                        <Cinder />
                    </SelectionProvider>
                </TabProvider>
            </DisksProvider>
        </KeysProvider>
    </PathProvider>
);
