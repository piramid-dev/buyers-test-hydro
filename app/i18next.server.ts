import { createCookie } from '@remix-run/cloudflare'
import { RemixI18Next } from 'remix-i18next'
import i18n from '~/i18n' // your i18n configuration file
import { resources } from '../public/locales/resources.js'

export let localeCookie = createCookie('locale', {
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production'
})

let i18next = new RemixI18Next({
	detection: {
		supportedLanguages: i18n.supportedLngs,
		fallbackLanguage: i18n.fallbackLng
		// cookie: localeCookie
	},
	// This is the configuration for i18next used
	// when translating messages server-side only
	i18next: {
		...i18n,
		resources
	}
})

export default i18next
