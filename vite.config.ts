import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dashboard calls the FastAPI backend directly via VITE_API_BASE_URL
// (see src/services/waterQualityService.ts); the backend configures CORS
// for localhost + Vercel, so no dev proxy is needed.
export default defineConfig({
  plugins: [react()],
});
