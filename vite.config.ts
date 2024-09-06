import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), pluginRewriteAll(), ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })],
})
