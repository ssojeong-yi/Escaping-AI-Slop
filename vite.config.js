import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build:single` → dist-single/index.html 한 파일에 JS·CSS·폰트를 모두 넣는다.
// 발표 PC에서 Node나 인터넷 없이 더블클릭으로 열 수 있다.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'single' ? [react(), viteSingleFile()] : [react()],
  server: { port: 5173, strictPort: true },
  build: mode === 'single' ? { outDir: 'dist-single' } : {},
}));
