import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "간단키오에듀",
        short_name: "간단키오에듀",
        description: "My React + Vite PWA",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/192.png", sizes: "192x192", type: "image/png" },
          { src: "/rv512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],

  build: {
    target: "es2015", // 🔥 이거 추가
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
