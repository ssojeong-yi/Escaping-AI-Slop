import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 한 파일 빌드는 file:// 로 열리므로 /favicon 경로를 쓸 수 없다.
// 32px 파비콘을 data URI로 넣고, 서버가 있어야 의미 있는 나머지 아이콘 링크는 뺀다.
function inlineFavicon() {
  return {
    name: 'inline-favicon',
    transformIndexHtml(html) {
      const png = readFileSync(new URL('./public/favicon-32x32.png', import.meta.url)).toString('base64');
      return html
        .replace(/\s*<link rel="(icon|apple-touch-icon|manifest)"[^>]*>/g, '')
        .replace('</title>', `</title>\n    <link rel="icon" type="image/png" href="data:image/png;base64,${png}" />`);
    },
  };
}

// `npm run build:single` → dist-single/index.html 한 파일에 JS·CSS·폰트·파비콘을 모두 넣는다.
// 발표 PC에서 Node나 인터넷 없이 더블클릭으로 열 수 있다.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'single' ? [react(), viteSingleFile(), inlineFavicon()] : [react()],
  server: { port: 5173, strictPort: true },
  // 한 파일 빌드에는 public/ 아이콘 파일을 따로 복사하지 않는다 (위에서 인라인 처리)
  build: mode === 'single' ? { outDir: 'dist-single', copyPublicDir: false } : {},
}));
