import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://www.hlopg.com",
        changeOrigin: true,
        secure: true,
      },
      "/uploads": {
        target: "https://www.hlopg.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
