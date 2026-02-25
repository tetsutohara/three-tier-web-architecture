import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: "./",
    server: {
      proxy: {
        '/api': env.VITE_API_URL,
      }
    }
  }
})