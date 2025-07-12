import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage/DashboardPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {/* <Route path="/urls/:id" element={<UrlDetailPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
