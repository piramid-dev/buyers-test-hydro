import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import isbot from 'isbot'
import { renderToReadableStream } from 'react-dom/server'
import { createInstance } from 'i18next'
import i18next from './i18next.server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18n from './i18n' // your i18n configuration file
import { resources } from '../public/locales/resources.js'

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	let instance = createInstance().use(initReactI18next)
	let ns = i18next.getRouteNamespaces(remixContext)
	// let lng = await i18next.getLocale(request) <- this always return the browser language

	// Check if url contains /it/ or /en/ and set lng accordingly
	const lng = request.url.indexOf('/it/') > 0 ? 'IT' : 'EN'

	await instance
		.use(initReactI18next) // Tell our instance to use react-i18next
		.init({
			...i18n, // spread the configuration
			lng, // The locale we detected above
			ns, // The namespaces the routes about to render wants to use
			resources
		})

	// console.log('***** server instance', instance)

	const body = await renderToReadableStream(
		<I18nextProvider i18n={instance}>
			<RemixServer context={remixContext} url={request.url} />
		</I18nextProvider>,

		{
			signal: request.signal,
			onError(error) {
				// eslint-disable-next-line no-console
				console.error(error)
				responseStatusCode = 500
			}
		}
	)

	if (isbot(request.headers.get('user-agent'))) {
		await body.allReady
	}

	responseHeaders.set('Content-Type', 'text/html')
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode
	})
}
