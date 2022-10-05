/**
 * @type {import('vite').UserConfig}
 */
export default {
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ReactTags',
      formats: ['es', 'cjs', 'umd'],
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
  test: {
    environment: 'jsdom',
    // HACK: <https://github.com/testing-library/user-event/issues/813>
    deps: {
      inline: ['@testing-library/user-event'],
    },
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['src/test/**', 'example/src/**'],
    },
  },
}
