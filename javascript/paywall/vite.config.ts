import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// ...
export default defineConfig({
  // ...
  define: {
    "process.env": {}
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis"
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }
});
