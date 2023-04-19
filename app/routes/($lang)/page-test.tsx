import type { LoaderArgs } from '@remix-run/server-runtime'
import { useLoaderData } from '@remix-run/react'
import { json } from '@shopify/remix-oxygen'
import { GraphQLClient, gql } from 'graphql-request'
import { getCustomer } from './account'

const GetAllReviews = gql`
	{
		allReviews {
			id
			title
			private
			_status
			_firstPublishedAt
		}

		_allReviewsMeta {
			count
		}
	}
`

export async function loader({ request, context, params }: LoaderArgs) {
	const customerAccessToken = await context.session.get('customerAccessToken')
	const isAuthenticated = Boolean(customerAccessToken)

	const DATO_CMS_API_TOKEN = '683f45d83be9d251e02d19e670893a'
	// const subscription_url = 'https://buyerstest.myshopify.com/apps/subscriptions'
	// Paywhirl
	const subscription_url = 'https://buyerstest.myshopify.com/a/paywhirl'
	const apiToken = 'A96TILD36tPYy8d0uNw0GM9Xu7aO9D2s2OD6YVPx'

	const customer = await getCustomer(context, customerAccessToken)
	// console.log(customer)
	const id = customer?.id.split('/').pop()
	const apiUrl = `${subscription_url}/subscriptions/${id}`

	// Fetch GET call
	const response = await fetch(apiUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	})

	// console.log('--- status', response.statusText)
	// console.log('--- response', response)

	if (!isAuthenticated) {
		return json({ isAuthenticated: false }) as any
	} else {
		// New graphql query
		const datoCms = new GraphQLClient('https://graphql.datocms.com/', {
			headers: {
				authorization: `Bearer ${DATO_CMS_API_TOKEN}`
			},
			fetch
		})

		const { allReviews } = (await datoCms.request(GetAllReviews)) as any

		return json({
			isAuthenticated: true,
			reviews: allReviews,
			customer,
			country: context.storefront.i18n.country,
			language: context.storefront.i18n.language
		}) as any
	}
}

const PageTest = () => {
	const data = useLoaderData<typeof loader>()
	const { isAuthenticated, reviews } = data

	console.log(data)

	return (
		<div>
			{isAuthenticated && <h2 className="font-bold">User is Authenticated</h2>}
			{reviews.map((review: any) => {
				return (
					<div key={review.id}>
						<h1>{review.title}</h1>
						<p>{review.private}</p>
					</div>
				)
			})}
		</div>
	)
}

export default PageTest
