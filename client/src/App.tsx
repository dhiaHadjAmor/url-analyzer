import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import DetailsPage from "./pages/DetailsPage/DetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/urls/:id" element={<DetailsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
