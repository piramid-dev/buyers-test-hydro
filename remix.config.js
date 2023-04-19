/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
	appDirectory: 'app',
	ignoredRouteFiles: ['**/.*'],
	watchPaths: ['./public'],
	server: './server.ts',
	/**
	 * The following settings are required to deploy Hydrogen apps to Oxygen:
	 */
	publicPath: (process.env.HYDROGEN_ASSET_BASE_URL ?? '/') + 'build/',
	assetsBuildDirectory: 'dist/client/build',
	serverBuildPath: 'dist/worker/index.js',
	serverMainFields: ['browser', 'module', 'main'],
	serverConditions: ['worker', process.env.NODE_ENV],
	serverDependenciesToBundle: 'all',
	serverModuleFormat: 'esm',
	serverPlatform: 'neutral',
	serverMinify: process.env.NODE_ENV === 'production',

	// Routes
	routes: defineRoutes => {
		// If you need to do async work, do it before calling `defineRoutes`, we use
		// the call stack of `route` inside to set nesting.

		console.log('++++routes')

		return defineRoutes(route => {
			// A common use for this is catchall routes.
			// - The first argument is the React Router path to match against
			// - The second is the relative filename of the route handler
			route('it/prodotti/:productHandle', 'pages/products/$productHandle.tsx')
			// 	route(
			// 		'en/products/:productHandle',
			// 		'routes/($lang)/products/$productHandle.tsx'
			// 	)
			route('/:lang/prodotti/', 'pages/products/index.tsx', {
				id: 'it-prodotti'
			})
			route('/en/products/', 'pages/products/index.tsx', {
				id: 'en-products'
			})
		})
	}
}

// exports.routes = async defineRoutes => {
// 	// If you need to do async work, do it before calling `defineRoutes`, we use
// 	// the call stack of `route` inside to set nesting.

// 	console.log('-----routes')

// 	return defineRoutes(route => {
// 		// A common use for this is catchall routes.
// 		// - The first argument is the React Router path to match against
// 		// - The second is the relative filename of the route handler
// 		route(':lang/prodotti/:productHandle', ':lang/products/:productHandle')
// 		route(':lang/prodotti/', ':lang/products/')
// 	})
// }
