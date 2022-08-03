import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // optimizeDeps: {
  //   include: [
  //     "gun",
  //     "gun/gun",
  //     "gun/sea",
  //     "gun/sea.js",
  //     "gun/lib/then",
  //     "gun/lib/webrtc",
  //     "gun/lib/radix",
  //     "gun/lib/radisk",
  //     "gun/lib/store",
  //     "gun/lib/rindexed",
  //   ],
  // },

  plugins: [react()],
});
