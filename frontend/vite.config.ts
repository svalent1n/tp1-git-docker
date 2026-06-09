import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración de Vite. El plugin de React habilita JSX y Fast Refresh.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceder al dev server desde fuera del contenedor
    port: 5173,
  },
});
