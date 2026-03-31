import fs from 'fs';
import path from 'path';

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

export default function adminFsApiPlugin() {
	// Security: Check if we are in a production/deployed environment
	const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

	function resolveFilePath(fileParam, rootDir) {
		const parts = fileParam.split('/');
		if (parts.length >= 2 && parts[1] === 'blog') {
			const lang = parts[0];
			const rest = parts.slice(2).join('/');
			return path.resolve(rootDir, `src/content/blog/${lang}/${rest}`);
		}
		return path.join(path.resolve(rootDir, 'public/data'), fileParam);
	}

	return {
		name: 'admin-fs-api',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				// Fix: Strip query params from admin page routes (non-API) before
				// Vite's internal middleware processes them. Vite misinterprets
				// ".md" in query params as a module import, causing ENOENT errors.
				// React Router reads query params client-side from window.location.
				if (req.url && req.url.startsWith('/admin/') && !req.url.startsWith('/admin/../') && req.url.includes('?')) {
					const qIndex = req.url.indexOf('?');
					const pathname = req.url.substring(0, qIndex);
					// Only rewrite for known admin page sub-routes, not API calls
					if (pathname === '/admin/editor' || pathname === '/admin/languages') {
						req.url = pathname;
						if (req.originalUrl) {
							req.originalUrl = pathname;
						}
					}
				}

				// Basic middleware to match /api/admin
				if (req.url && req.url.startsWith('/api/admin')) {
					// --- Environment Safety Lock ---
					// Disable all mutating operations (POST, DELETE, etc.) in non-local environments
					if (isProd && req.method !== 'GET') {
						console.warn(`[Admin Security] Blocked ${req.method} request to ${req.url} in production.`);
						res.statusCode = 403;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ 
							error: 'Permission Denied', 
							message: 'Content management is only allowed in local development environment.' 
						}));
						return;
					}

					// Manually parse the URL to handle query params
					const protocol = req.socket?.encrypted ? 'https' : 'http';
					const host = req.headers.host || 'localhost';
					const url = new URL(req.url, `${protocol}://${host}`);

					// --- CMS V2 API ---
					const rootDir = process.cwd();

					// LIST LANGUAGES
					if (url.pathname === '/api/admin/languages' && req.method === 'GET') {
						try {
							const dataDir = path.resolve(rootDir, 'public/data');
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

								const srcDir = path.resolve(rootDir, 'public/data/zh');
								const destDir = path.resolve(rootDir, `public/data/${code}`);

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

								const targetDir = path.resolve(rootDir, `public/data/${code}`);
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

						const masterPath = path.join(path.resolve(rootDir, 'public/data/zh'), fileParam);

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
							const imagesDir = path.resolve(rootDir, 'public/images');
							const allFiles = getFiles(imagesDir);
							const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];

							const images = allFiles
								.filter(f => imageExtensions.some(ext => f.toLowerCase().endsWith(ext)))
								.map(f => {
									const relativePath = path.relative(path.resolve(rootDir, 'public'), f);
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

								const imagesDir = path.resolve(rootDir, 'public/images');
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

						const safePath = resolveFilePath(fileParam, rootDir);
						// Security check
						const isDataDir = safePath.startsWith(path.resolve(rootDir, 'public/data'));
						const isBlogDir = safePath.startsWith(path.resolve(rootDir, 'src/content/blog'));
						if (!isDataDir && !isBlogDir) {
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
								? path.resolve(rootDir, `public/data/${lang}`)
								: path.resolve(rootDir, 'public/data');

							if (!fs.existsSync(dataDir)) {
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({ files: [] }));
								return;
							}
							const files = getFiles(dataDir).map(f => path.relative(dataDir, f)).filter(f => f.endsWith('.json') || f.endsWith('.md'));
							
							// Virtual mapping for blog content
							const blogDir = lang
								? path.resolve(rootDir, `src/content/blog/${lang}`)
								: path.resolve(rootDir, 'src/content/blog');
							if (fs.existsSync(blogDir)) {
								const blogFiles = getFiles(blogDir)
									.map(f => path.relative(blogDir, f))
									.filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
									.map(f => {
										const fPosix = f.split(path.sep).join('/');
										if (lang) {
											return `blog/${fPosix}`;
										} else {
											const parts = fPosix.split('/');
											if (parts.length >= 2) {
												return `${parts[0]}/blog/${parts.slice(1).join('/')}`;
											}
											return `blog/${fPosix}`;
										}
									});
								files.push(...blogFiles);
							}
							
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

						// Security check: only allow files inside public/data or content/blog
						const safePath = resolveFilePath(fileParam, rootDir);
						const isDataDir = safePath.startsWith(path.resolve(rootDir, 'public/data'));
						const isBlogDir = safePath.startsWith(path.resolve(rootDir, 'src/content/blog'));
						if (!isDataDir && !isBlogDir) {
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
						let chunks = [];
						req.on('data', chunk => chunks.push(chunk));
						req.on('end', () => {
							try {
								const body = Buffer.concat(chunks).toString('utf-8');
								const { file, content } = JSON.parse(body);
								if (!file || !content) {
									res.statusCode = 400;
									res.end(JSON.stringify({ error: 'Missing file or content' }));
									return;
								}

								// Security check
								const safePath = resolveFilePath(file, rootDir);
								const isDataDir = safePath.startsWith(path.resolve(rootDir, 'public/data'));
								const isBlogDir = safePath.startsWith(path.resolve(rootDir, 'src/content/blog'));
								if (!isDataDir && !isBlogDir) {
									res.statusCode = 403;
									res.end(JSON.stringify({ error: 'Access denied' }));
									return;
								}
								
								// Ensure parent directory exists for new files
								const dirName = path.dirname(safePath);
								if (!fs.existsSync(dirName)) {
									fs.mkdirSync(dirName, { recursive: true });
								}

								// Sanitize markdown content before writing for blog files
								let writeContent;
								if (typeof content === 'string') {
									writeContent = content;
									// For .md files in content collection, sanitize dangerous patterns
									// that crash Astro: empty image src ![alt]() or link [text]()
									if (file.endsWith('.md') && isBlogDir) {
										// Replace ![any]() with <!-- ![any](placeholder) -->
										writeContent = writeContent.replace(/!\[([^\]]*)\]\(\s*\)/g, '<!-- ![$1](needs-image-url) -->');
										// Replace [text]() with [text](#) 
										writeContent = writeContent.replace(/\[([^\]]*)\]\(\s*\)/g, '[$1](#)');
									}
								} else {
									writeContent = JSON.stringify(content, null, 2);
								}
								fs.writeFileSync(safePath, writeContent);

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
}
