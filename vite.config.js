import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // .env의 모든 키를 읽는다(VITE_ 접두사 없는 DART_API_KEY 포함)
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
        // 배포 환경의 api/dart.js 서버리스 함수를 개발 서버에서 흉내낸다.
        // DART는 CORS를 허용하지 않으므로 dev 서버가 대신 요청하고, crtfc_key도 여기서 붙인다.
        '/api/dart': {
          target: 'https://opendart.fss.or.kr',
          changeOrigin: true,
          rewrite: (path) => {
            const query = path.split('?')[1] ?? ''
            const params = new URLSearchParams(query)
            params.set('crtfc_key', env.DART_API_KEY ?? '')
            return `/api/fnlttSinglAcnt.json?${params.toString()}`
          },
        },
      },
    },
  }
})
