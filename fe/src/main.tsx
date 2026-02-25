import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderComplete from "./pages/OrderComplete";

import "./index.css";
import ButcherPage from "./pages/ButcherPage";
import App from "./App";

import SectionManagePage from "./admin/SectionManagePage";
import SectionDetailPage from "./admin/SectionDetailPage";
import TestPage from "./pages/TestPage";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<TestPage />} /> */}
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<SectionManagePage />} />
        <Route
          path="/admin/sections/:sectionId"
          element={<SectionDetailPage />}
        />
        <Route path="/section/:id" element={<ButcherPage />} />
        <Route path="/order-complete" element={<OrderComplete />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>,
);
