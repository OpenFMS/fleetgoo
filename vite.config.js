import path from 'node:path';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';
import Sitemap from 'vite-plugin-sitemap';

import iframeRouteRestorationPlugin from './plugins/vite-plugin-iframe-route-restoration.js';
import selectionModePlugin from './plugins/selection-mode/vite-plugin-selection-mode.js';
import fs from 'fs'; // Added fs import

// Helper to recursively finding files
function getFiles(dir, files = []) {
	try {
		if (!fs.existsSync(dir)) return [];
		const fileList = fs.readdirSync(dir);
		for (const file of fileList) {
			const name = path.join(dir, file);
			if (fs.statSync(name).isDirectory()) {
				getFiles(name, files);
			} else {
				if (!file.startsWith('.')) {
					files.push(name);
				}
			}
		}
	} catch (e) {
		console.warn("Directory not found or inaccessible:", dir);
	}
	return files;
}

// Helper for recursive copy
function copyRecursiveSync(src, dest) {
	if (!fs.existsSync(src)) return;
	const stats = fs.statSync(src);
	if (stats.isDirectory()) {
		if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
		fs.readdirSync(src).forEach((childItemName) => {
			copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	} else {
		fs.copyFileSync(src, dest);
	}
}

// Generate routes dynamically from JSON data
const generateRoutes = () => {
	const routes = [];
	const dataDir = path.resolve(__dirname, 'public/data');
	const languages = fs.existsSync(dataDir)
		? fs.readdirSync(dataDir, { withFileTypes: true })
			.filter(ent => ent.isDirectory())
			.map(ent => ent.name)
		: ['en'];

	languages.forEach(lang => {
		// Base routes
		routes.push(`/${lang}`);
		routes.push(`/${lang}/products`);
		routes.push(`/${lang}/solutions`);
		routes.push(`/${lang}/software`);
		routes.push(`/${lang}/about-us`);
		routes.push(`/${lang}/contact`);

		// Products
		try {
			const productsPath = path.resolve(__dirname, `public/data/${lang}/products.json`);
			if (fs.existsSync(productsPath)) {
				const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
				if (productsData.items) {
					productsData.items.forEach(item => {
						routes.push(`/${lang}/products/${item.id}`);
					});
				}
			}
		} catch (e) {
			console.warn(`Warning: Could not load products for ${lang}`, e.message);
		}

		// Solutions
		try {
			const solutionsPath = path.resolve(__dirname, `public/data/${lang}/solutions.json`);
			if (fs.existsSync(solutionsPath)) {
				const solutionsData = JSON.parse(fs.readFileSync(solutionsPath, 'utf-8'));
				if (solutionsData.items) {
					solutionsData.items.forEach(item => {
						routes.push(`/${lang}/solutions/${item.id}`);
					});
				}
			}
		} catch (e) {
			console.warn(`Warning: Could not load solutions for ${lang}`, e.message);
		}
	});

	return routes;
};

const isDev = process.env.NODE_ENV !== 'production';

const configHorizonsViteErrorHandler = `
const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		for (const addedNode of mutation.addedNodes) {
			if (
				addedNode.nodeType === Node.ELEMENT_NODE &&
				(
					addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
					addedNode.classList?.contains('backdrop')
				)
			) {
				handleViteOverlay(addedNode);
			}
		}
	}
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});

function handleViteOverlay(node) {
	if (!node.shadowRoot) {
		return;
	}

	const backdrop = node.shadowRoot.querySelector('.backdrop');

	if (backdrop) {
		const overlayHtml = backdrop.outerHTML;
		const parser = new DOMParser();
		const doc = parser.parseFromString(overlayHtml, 'text/html');
		const messageBodyElement = doc.querySelector('.message-body');
		const fileElement = doc.querySelector('.file');
		const messageText = messageBodyElement ? messageBodyElement.textContent.trim() : '';
		const fileText = fileElement ? fileElement.textContent.trim() : '';
		const error = messageText + (fileText ? ' File:' + fileText : '');

		window.parent.postMessage({
			type: 'horizons-vite-error',
			error,
		}, '*');
	}
}
`;

const configHorizonsRuntimeErrorHandler = `
window.onerror = (message, source, lineno, colno, errorObj) => {
	const errorDetails = errorObj ? JSON.stringify({
		name: errorObj.name,
		message: errorObj.message,
		stack: errorObj.stack,
		source,
		lineno,
		colno,
	}) : null;

	window.parent.postMessage({
		type: 'horizons-runtime-error',
		message,
		error: errorDetails
	}, '*');
};
`;

const configHorizonsConsoleErrroHandler = `
const originalConsoleError = console.error;
console.error = function(...args) {
	originalConsoleError.apply(console, args);

	let errorString = '';

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg instanceof Error) {
			errorString = arg.stack || \`\${arg.name}: \${arg.message}\`;
			break;
		}
	}

	if (!errorString) {
		errorString = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
	}

	window.parent.postMessage({
		type: 'horizons-console-error',
		error: errorString
	}, '*');
};
`;

const configWindowFetchMonkeyPatch = `
const originalFetch = window.fetch;

window.fetch = function(...args) {
	const url = args[0] instanceof Request ? args[0].url : args[0];

	// Skip WebSocket URLs
	if (url.startsWith('ws:') || url.startsWith('wss:')) {
		return originalFetch.apply(this, args);
	}

	return originalFetch.apply(this, args)
		.then(async response => {
			const contentType = response.headers.get('Content-Type') || '';

			// Exclude HTML document responses
			const isDocumentResponse =
				contentType.includes('text/html') ||
				contentType.includes('application/xhtml+xml');

			if (!response.ok && !isDocumentResponse) {
					const responseClone = response.clone();
					const errorFromRes = await responseClone.text();
					const requestUrl = response.url;
					console.error(\`Fetch error from \${requestUrl}: \${errorFromRes}\`);
			}

			return response;
		})
		.catch(error => {
			if (!url.match(/\.html?$/i)) {
				console.error(error);
			}

			throw error;
		});
};
`;

const configNavigationHandler = `
if (window.navigation && window.self !== window.top) {
	window.navigation.addEventListener('navigate', (event) => {
		const url = event.destination.url;

		try {
			const destinationUrl = new URL(url);
			const destinationOrigin = destinationUrl.origin;
			const currentOrigin = window.location.origin;

			if (destinationOrigin === currentOrigin) {
				return;
			}
		} catch (error) {
			return;
		}

		window.parent.postMessage({
			type: 'horizons-navigation-error',
			url,
		}, '*');
	});
}
`;

const addTransformIndexHtml = {
	name: 'add-transform-index-html',
	transformIndexHtml(html) {
		const tags = [
			{
				tag: 'script',
				attrs: { type: 'module' },
				children: configHorizonsRuntimeErrorHandler,
				injectTo: 'head',
			},
			{
				tag: 'script',
				attrs: { type: 'module' },
				children: configHorizonsViteErrorHandler,
				injectTo: 'head',
			},
			{
				tag: 'script',
				attrs: { type: 'module' },
				children: configHorizonsConsoleErrroHandler,
				injectTo: 'head',
			},
			{
				tag: 'script',
				attrs: { type: 'module' },
				children: configWindowFetchMonkeyPatch,
				injectTo: 'head',
			},
			{
				tag: 'script',
				attrs: { type: 'module' },
				children: configNavigationHandler,
				injectTo: 'head',
			},
		];

		if (!isDev && process.env.TEMPLATE_BANNER_SCRIPT_URL && process.env.TEMPLATE_REDIRECT_URL) {
			tags.push(
				{
					tag: 'script',
					attrs: {
						src: process.env.TEMPLATE_BANNER_SCRIPT_URL,
						'template-redirect-url': process.env.TEMPLATE_REDIRECT_URL,
					},
					injectTo: 'head',
				}
			);
		}

		return {
			html,
			tags,
		};
	},
};

console.warn = () => { };

const logger = createLogger()
const loggerError = logger.error

logger.error = (msg, options) => {
	if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
		return;
	}

	loggerError(msg, options);
}

export default defineConfig({
	customLogger: logger,
	plugins: [
		...(isDev ? [iframeRouteRestorationPlugin(), selectionModePlugin()] : []),
		react(),
		{
			name: 'watch-public-data',
			configureServer(server) {
				server.watcher.add(path.resolve(__dirname, 'public/data'));
				server.watcher.on('change', (file) => {
					if (file.includes('public/data')) {
						server.ws.send({
							type: 'full-reload',
						});
					}
				});
			},
		},
		addTransformIndexHtml,
		Sitemap({
			hostname: process.env.SITE_URL || 'https://www.fleetgpstrack.com',
			dynamicRoutes: generateRoutes(),
			changefreq: 'weekly',
			priority: 1.0,
			readable: true
		}),
		{
			name: 'admin-fs-api',
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					// Basic middleware to match /api/admin
					if (req.url && req.url.startsWith('/api/admin')) {
						// Manually parse the URL to handle query params
						// Note: in generic middleware, req.url is the full path from the root
						const protocol = req.socket.encrypted ? 'https' : 'http';
						const host = req.headers.host || 'localhost';
						const url = new URL(req.url, `${protocol}://${host}`);

						// --- CMS V2 API ---

						// LIST LANGUAGES
						if (url.pathname === '/api/admin/languages' && req.method === 'GET') {
							try {
								const dataDir = path.resolve(__dirname, 'public/data');
								if (!fs.existsSync(dataDir)) {
									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify({ languages: [] }));
									return;
								}
								const entries = fs.readdirSync(dataDir, { withFileTypes: true });
								const languages = entries
									.filter(ent => ent.isDirectory())
									.map(ent => ({
										code: ent.name,
										isMaster: ent.name === 'zh'
									}));
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({ languages }));
								return;
							} catch (err) {
								res.statusCode = 500;
								res.end(JSON.stringify({ error: err.message }));
								return;
							}
						}

						// CREATE LANGUAGE
						if (url.pathname === '/api/admin/languages' && req.method === 'POST') {
							let body = '';
							req.on('data', chunk => body += chunk);
							req.on('end', () => {
								try {
									const { code } = JSON.parse(body);
									if (!code) throw new Error("Language code is required");

									const srcDir = path.resolve(__dirname, 'public/data/zh');
									const destDir = path.resolve(__dirname, `public/data/${code}`);

									if (fs.existsSync(destDir)) throw new Error(`Language '${code}' already exists`);
									if (!fs.existsSync(srcDir)) throw new Error("Master language 'zh' does not exist");

									copyRecursiveSync(srcDir, destDir);

									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify({ success: true, message: `Created ${code}` }));
								} catch (err) {
									res.statusCode = 500;
									res.end(JSON.stringify({ error: err.message }));
								}
							});
							return;
						}

						// DELETE LANGUAGE
						if (url.pathname === '/api/admin/languages' && req.method === 'DELETE') {
							let body = '';
							req.on('data', chunk => body += chunk);
							req.on('end', () => {
								try {
									const { code } = JSON.parse(body);
									if (!code) throw new Error("Language code is required");
									if (code === 'zh') throw new Error("Cannot delete master language 'zh'");

									const targetDir = path.resolve(__dirname, `public/data/${code}`);
									if (!fs.existsSync(targetDir)) throw new Error("Language not found");

									fs.rmSync(targetDir, { recursive: true, force: true });

									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify({ success: true }));
								} catch (err) {
									res.statusCode = 500;
									res.end(JSON.stringify({ error: err.message }));
								}
							});
							return;
						}

						// GET MASTER CONTENT
						if (url.pathname === '/api/admin/master-content' && req.method === 'GET') {
							const fileParam = url.searchParams.get('file');
							if (!fileParam) {
								res.statusCode = 400;
								res.end(JSON.stringify({ error: 'Missing file parameter' }));
								return;
							}

							const masterPath = path.join(path.resolve(__dirname, 'public/data/zh'), fileParam);

							try {
								if (!fs.existsSync(masterPath)) {
									res.statusCode = 404;
									res.end(JSON.stringify({ error: 'Master file not found' }));
									return;
								}
								const content = fs.readFileSync(masterPath, 'utf-8');
								res.setHeader('Content-Type', 'application/json');
								res.end(content);
								return;
							} catch (err) {
								res.statusCode = 500;
								res.end(JSON.stringify({ error: err.message }));
								return;
							}
						}

						// LIST IMAGES
						if (url.pathname === '/api/admin/images' && req.method === 'GET') {
							try {
								const imagesDir = path.resolve(__dirname, 'public/images');
								const allFiles = getFiles(imagesDir);
								const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];

								const images = allFiles
									.filter(f => imageExtensions.some(ext => f.toLowerCase().endsWith(ext)))
									.map(f => {
										const relativePath = path.relative(path.resolve(__dirname, 'public'), f);
										return '/' + relativePath;
									});

								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({ images }));
								return;
							} catch (err) {
								res.statusCode = 500;
								res.end(JSON.stringify({ error: err.message }));
								return;
							}
						}

						// UPLOAD IMAGE (Base64)
						if (url.pathname === '/api/admin/upload-image' && req.method === 'POST') {
							let body = '';
							req.on('data', chunk => body += chunk);
							req.on('end', () => {
								try {
									const { filename, content } = JSON.parse(body);
									if (!filename || !content) throw new Error("Filename and content required");

									// Remove header if present (e.g. "data:image/png;base64,")
									const base64Data = content.replace(/^data:image\/\w+;base64,/, "");
									const buffer = Buffer.from(base64Data, 'base64');

									const imagesDir = path.resolve(__dirname, 'public/images');
									if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

									const filePath = path.join(imagesDir, filename);
									fs.writeFileSync(filePath, buffer);

									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify({ success: true, path: '/images/' + filename }));
								} catch (err) {
									res.statusCode = 500;
									res.end(JSON.stringify({ error: err.message }));
								}
							});
							return;
						}

						// DELETE FILE
						if (url.pathname === '/api/admin/files' && req.method === 'DELETE') {
							const fileParam = url.searchParams.get('file');
							if (!fileParam) {
								res.statusCode = 400;
								res.end(JSON.stringify({ error: 'Missing file parameter' }));
								return;
							}

							const safePath = path.join(path.resolve(__dirname, 'public/data'), fileParam);
							// Security check
							if (!safePath.startsWith(path.resolve(__dirname, 'public/data'))) {
								res.statusCode = 403;
								res.end(JSON.stringify({ error: 'Access denied' }));
								return;
							}

							try {
								if (fs.existsSync(safePath)) {
									fs.unlinkSync(safePath);
									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify({ success: true }));
								} else {
									res.statusCode = 404;
									res.end(JSON.stringify({ error: 'File not found' }));
								}
							} catch (err) {
								res.statusCode = 500;
								res.end(JSON.stringify({ error: err.message }));
							}
							return;
						}

						// 1. LIST FILES
						if (url.pathname === '/api/admin/files' && req.method === 'GET') {
							try {
								const lang = url.searchParams.get('lang');
								const dataDir = lang
									? path.resolve(__dirname, `public/data/${lang}`)
									: path.resolve(__dirname, 'public/data');

								if (!fs.existsSync(dataDir)) {
									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify({ files: [] }));
									return;
								}
								const files = getFiles(dataDir).map(f => path.relative(dataDir, f)).filter(f => f.endsWith('.json') || f.endsWith('.md'));
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({ files }));
								return;
							} catch (err) {
								res.statusCode = 500;
								res.end(JSON.stringify({ error: err.message }));
								return;
							}
						}

						// 2. READ FILE
						if (url.pathname === '/api/admin/content' && req.method === 'GET') {
							const fileParam = url.searchParams.get('file');
							if (!fileParam) {
								res.statusCode = 400;
								res.end(JSON.stringify({ error: 'Missing file parameter' }));
								return;
							}

							// Security check: only allow files inside public/data
							const safePath = path.join(path.resolve(__dirname, 'public/data'), fileParam);
							if (!safePath.startsWith(path.resolve(__dirname, 'public/data'))) {
								res.statusCode = 403;
								res.end(JSON.stringify({ error: 'Access denied' }));
								return;
							}

							try {
								if (!fs.existsSync(safePath)) {
									res.statusCode = 404;
									res.end(JSON.stringify({ error: 'File not found' }));
									return;
								}
								const content = fs.readFileSync(safePath, 'utf-8');
								res.setHeader('Content-Type', 'application/json');
								res.end(content);
								return;
							} catch (err) {
								res.statusCode = 500;
								res.end(JSON.stringify({ error: err.message }));
								return;
							}
						}

						// 3. WRITE FILE
						if (url.pathname === '/api/admin/content' && req.method === 'POST') {
							// Basic body parsing
							let body = '';
							req.on('data', chunk => {
								body += chunk.toString();
							});
							req.on('end', () => {
								try {
									const { file, content } = JSON.parse(body);
									if (!file || !content) {
										res.statusCode = 400;
										res.end(JSON.stringify({ error: 'Missing file or content' }));
										return;
									}

									// Security check
									const safePath = path.join(path.resolve(__dirname, 'public/data'), file);
									if (!safePath.startsWith(path.resolve(__dirname, 'public/data'))) {
										res.statusCode = 403;
										res.end(JSON.stringify({ error: 'Access denied' }));
										return;
									}

									// Write formatted JSON
									const jsonString = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
									fs.writeFileSync(safePath, jsonString);

									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify({ success: true }));
								} catch (err) {
									res.statusCode = 500;
									res.end(JSON.stringify({ error: err.message }));
								}
							});
							return;
						}
					}

					next();
				});
			}
		}
	],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json',],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types'
			]
		}
	}
});
