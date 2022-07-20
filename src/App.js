import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from "./pages/home-page";
import HeaderComponent from "./components/haeder-component/header-component";
import VideosPage from "./pages/videos-page/videos-page";

function App() {
    return  <>
        <HeaderComponent />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/videos" element={<VideosPage />} />
        </Routes>
    </>;
}

export default App;
