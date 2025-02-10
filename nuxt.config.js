export default defineNuxtConfig({
  app: {
    baseURL: '/',
  },
  server: {
    host: '0.0.0.0', // 允許外部連線 (IIS)
    port: process.env.PORT || 3000, // IIS 轉發請求到這個 Port
  },
  nitro: {
    preset: 'node-server', // 使用 Node.js 伺服器
  },
})