import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderComplete from "./pages/OrderComplete";

import "./index.css";
import ButcherPage from "./pages/ButcherPage";
import App from "./App";

import SectionManagePage from "./admin/SectionManagePage";
import SectionDetailPage from "./admin/SectionDetailPage";
import DebugPage from "./pages/DebugPage";
import Cart from "./pages/selfcounter/Cart";
import CartOrderComplete from "./pages/selfcounter/CartOrderComplete";
import CardTest from "./card/CardTest";
import TestButcherPage from "./card/TestButcherPage";
import TestOrderComplete from "./card/TestOrderComplete";
// import TestPage from "./pages/TestPage";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<TestPage />} /> */}
        <Route path="/" element={<App />} />
        <Route path="/testpage" element={<CardTest />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/admin" element={<SectionManagePage />} />
        <Route
          path="/admin/sections/:sectionId"
          element={<SectionDetailPage />}
        />
        <Route path="/section/:id" element={<ButcherPage />} />
        <Route path="/order-complete" element={<OrderComplete />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/order-complete" element={<CartOrderComplete />} />

        <Route path="/test/butcherpage" element={<TestButcherPage />} />
        <Route path="/test/order-complete" element={<TestOrderComplete />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>,
);
