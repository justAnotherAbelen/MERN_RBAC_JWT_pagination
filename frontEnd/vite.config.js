import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],

  /// server.proxy["/api"] means: any frontend request starting with /api is not handled by Vite
  /// Instead, Vite forwards it to target: "http://localhost:5000" (your backend).
  /// So in React you can write: axios.get("/api/auth/refresh") and in dev it becomes a backend call to: http://localhost:5000/api/auth/refresh
  /// => Avoids hardcoding backend URLs in frontend code.
  server : {
    proxy : {
      "/api" : {
        target : "http://localhost:5000",
        changeOrigin: true,
      }
    }
  }

})
