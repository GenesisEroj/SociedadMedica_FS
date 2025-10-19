// karma.conf.cjs — SOLO JSX
console.log('USANDO karma.conf.cjs DE:', __filename);
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'tests/setup.js', watched: false },
      { pattern: 'tests/App.spec.jsx', watched: false }   // <— apuntamos directo al archivo
    ],
    preprocessors: {
      'tests/App.spec.jsx': ['esbuild'],
      'tests/setup.js': ['esbuild'],
      'src/**/*.jsx': ['esbuild']
    },
    esbuild: {
      jsx: 'automatic',
      target: 'es2020',
      format: 'iife',
      sourcemap: true,
      loader: {
        '.jsx': 'jsx',
        '.js': 'jsx' // por si algo interno entra como .js
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('test')
      }
    },
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity,
    client: { jasmine: { random: false }, clearContext: false }
  });
};
