import type { LoaderArgs } from '@remix-run/server-runtime'
import { authenticator } from '~/utils/auth.server'

export const loader = async ({ request }: LoaderArgs) => {
	const auth = await authenticator.authenticate('auth0', request, {
		successRedirect: '/products',
		failureRedirect: '/login'
	})

	return auth
}
