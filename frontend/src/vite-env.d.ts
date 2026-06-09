/// <reference types="vite/client" />

// Tipado de las variables de entorno expuestas a la app (prefijo VITE_).
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
