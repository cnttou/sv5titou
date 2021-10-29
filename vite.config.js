import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import vitePluginImp from 'vite-plugin-imp';

// https://vitejs.dev/config/
export default defineConfig({
	hmr: { overlay: false },
	plugins: [
		reactRefresh(),
		vitePluginImp({
			libList: [
				{
					libName: 'antd',
					style: (name) => {
						if (name === 'col' || name === 'row') {
							return 'antd/lib/style/index.less';
						}
						return `antd/es/${name}/style/index.less`;
					},
				},
			],
		}),
	],
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
	},
	// build: {
	// 	minify: 'esbuild',
	// },
	esbuild: {
		jsxInject: "import * as React from 'react'",
	},
});
