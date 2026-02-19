import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderComplete from "./pages/OrderComplete";
import App from "./App";
import "./index.css";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/order-complete" element={<OrderComplete />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>,
);
