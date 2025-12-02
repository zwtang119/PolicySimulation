
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // Github Pages 部署关键配置：使用相对路径
    base: './', 
    define: {
      // 兼容 process.env.API_KEY 的写法，使其在构建时被替换，优先使用 VITE_ 前缀的变量
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || '')
    }
  };
});
