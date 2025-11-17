import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { extname, relative, resolve } from 'path'
import { globSync } from 'glob'
import dts from 'unplugin-dts/vite'

const tsFiles = globSync('src/**/*.ts?(x)', {
  ignore: ['src/**/*.stories.tsx', 'src/stories/**'],
})

const inputs = Object.fromEntries(
  tsFiles.map((file) => [
    relative(resolve('src'), file.slice(0, file.length - extname(file).length)),
    resolve(file),
  ]),
)

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      bundle: false,
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: false,
    rollupOptions: {
      external: [
        '@coreui/react',
        '@fortawesome/free-regular-svg-icons',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'lodash-es',
        'react',
        'react-dom',
        'react-draggable',
        'react/jsx-runtime',
        'semantic-ui-react',
      ],
      input: inputs,
      preserveEntrySignatures: 'exports-only',

      output: [
        {
          format: 'es',
          dir: 'dist',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
      ],
    },
  },
})
