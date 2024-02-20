import Sidebar from "./components/Sidebar";
import { usePath } from "./hooks/usePath";
import ErrorBox from "./components/ErrorBox";
import { useSelection } from "./hooks/useSelection";
import PathTextInput from "./components/PathTextInput";
import ViewToggle from "./components/ViewToggle";
import TabManager from "./components/TabManager";
import ArrowBack from "./components/ArrowBack";
import WindowControls from "./components/WindowControls";
import { getLayout } from "./hooks/usePath";
import { ViewProvider } from "./hooks/useView";
import "./styles/cinder.sass";
import "./styles/global.sass";

function Cinder() {
    const { error, resetError } = usePath();
    const { path } = usePath();
    const { handleMouseUp } = useSelection();

    return (
        <>
            <div className={"cinder"} onMouseLeave={handleMouseUp}>
                {error && <ErrorBox error={error} close={resetError} />}
                <Sidebar />
                <ViewProvider>
                    <main>
                        <header>
                            <div className="tab-row" data-tauri-drag-region>
                                <TabManager />
                                <WindowControls />
                            </div>
                            <div className="path-row">
                                <ArrowBack />
                                <PathTextInput />
                                <ViewToggle />
                            </div>
                        </header>
                        {getLayout(path)}
                    </main>
                </ViewProvider>
            </div>
        </>
    );
}

export default Cinder;
