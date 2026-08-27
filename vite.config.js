import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // DART(OpenDART) API는 브라우저 요청에 CORS 허용 헤더를 내려주지 않아 개발 서버가 대신 요청을 전달하도록 프록시 처리
      '/dart-api': {
        target: 'https://opendart.fss.or.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dart-api/, '/api'),
      },
    },
  },
})
