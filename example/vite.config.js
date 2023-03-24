import reactRefresh from '@vitejs/plugin-react-refresh'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  root: './src',
  plugins: [reactRefresh()],
  build: {
    outDir: '../build/',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: null,
        entryFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
    },
  },
}
