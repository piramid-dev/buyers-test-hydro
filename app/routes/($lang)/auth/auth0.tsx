// app/routes/auth/auth0.tsx
import { authenticator } from '~/utils/auth.server'
import type { ActionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'

export const loader = () => redirect('/login')

export const action = ({ request }: ActionArgs) => {
	console.log('!!!!action')
	return authenticator.authenticate('auth0', request)
}
