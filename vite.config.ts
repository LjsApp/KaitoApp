import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Eksplisit inject server-side env vars agar tersedia di process.env dalam server functions
export default ({ mode }: { mode: string }) => {
  // Load SEMUA env vars (termasuk yang tidak ber-prefix VITE_)
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    define: {
      // Inject server-only vars — hanya tersedia di server bundle, tidak ke client
      "process.env.SUPABASE_URL": JSON.stringify(
        env.SUPABASE_URL || env.VITE_SUPABASE_URL
      ),
      "process.env.SUPABASE_SERVICE_ROLE_KEY": JSON.stringify(
        env.SUPABASE_SERVICE_ROLE_KEY
      ),
      "process.env.ADMIN_SESSION_SECRET": JSON.stringify(
        env.ADMIN_SESSION_SECRET
      ),
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    plugins: [
      tsconfigPaths(),
      tanstackStart(),
      viteReact(),
      tailwindcss(),
    ],
    server: {
      port: 8080,
      host: "0.0.0.0",
    },
  });
};
