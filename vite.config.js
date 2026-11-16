import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Port 5174 (not Vite's default 5173) so this never clashes with the Tooth Fairy dev server.
// strictPort: fail instead of silently moving to another port, so tests always hit this app.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
});
