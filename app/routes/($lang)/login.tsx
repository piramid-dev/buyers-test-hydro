import { authenticator } from '~/utils/auth.server'
import { useLoaderData } from '@remix-run/react'

export async function loader({ request }: ActionArgs) {
	const user = await authenticator.isAuthenticated(request)
	console.log('------ user', user)
	return user
}

export default function Login() {
	const data = useLoaderData()
	console.log('data: ', data)

	return (
		<form className="px-12" action="/auth/auth0" method="post">
			<button className="inline-block rounded font-medium text-center py-3 px-6 bg-primary text-contrast w-full">
				Login with Auth0
			</button>
		</form>
	)
}
