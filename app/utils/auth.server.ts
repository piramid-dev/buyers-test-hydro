// app/services/auth.server.ts
import { sessionStorage } from '~/utils/session.server'
import { Authenticator } from 'remix-auth'
import { Auth0Strategy } from 'remix-auth-auth0'

// type User = {
//   id: string;
//   email: string;
//   name: string;
//   token: string;
// };

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<User>(sessionStorage)

const auth0Strategy = new Auth0Strategy(
	{
		callbackURL: 'http://localhost:3000/auth/auth0/callback',
		clientID: 'bCUskZw1IKqAQmevc8hZMaxRBsrmTuQl',
		clientSecret:
			'It8SJpb57j6ITBpVndbwbUnSrHa4TDS6pufiUQHGmqCncq8tjDyPYA5fhuh0W_HM',
		domain: 'buyers-test-eu-tenant.eu.auth0.com'
	},
	async ({ accessToken, refreshToken, extraParams, profile }) => {
		// Get the user data from your DB or API using the tokens and profile
		// return User.findOrCreate({email: profile.emails[0].value});
		console.log('profile', profile)

		return profile
	}
)

authenticator.use(auth0Strategy)
