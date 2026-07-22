// Vite config for PULSE — Enterprise Product Intelligence.
// The TanStack Start + Nitro build is managed by the Lovable Vite plugin.
// Do NOT add plugins manually — the wrapper injects them (React, Tailwind, Nitro, etc).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
