import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Samples from "./pages/Samples";
import Analytics from "./pages/Analytics";
import Researchers from "./pages/Researchers";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/samples"
          element={<Samples />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/researchers"
          element={<Researchers />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;