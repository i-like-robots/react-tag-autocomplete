/**
 * @type {import('vite').UserConfig}
 */
export default {
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ReactTags',
      fileName: (format) => `ReactTags.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
        },
      },
    },
  },
}
