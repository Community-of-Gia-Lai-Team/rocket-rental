import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useCatch, useLoaderData, useParams } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { getUserByUsername } from '~/models/user.server'

export async function loader({ request, params }: LoaderArgs) {
	invariant(params.username, 'Missing username')
	const user = await getUserByUsername(params.username)
	if (!user) {
		throw new Response('not found', { status: 404 })
	}
	return json({ user })
}

export default function UserRoute() {
	const data = useLoaderData<typeof loader>()
	return (
		<div>
			<h1>User</h1>
			{data.user.imageUrl ? (
				<img
					src={data.user.imageUrl}
					alt={data.user.name ?? data.user.username}
				/>
			) : null}
			<pre>{JSON.stringify(data, null, 2)}</pre>
			<hr />
			<Outlet />
		</div>
	)
}

export function CatchBoundary() {
	const caught = useCatch()
	const params = useParams()

	if (caught.status === 404) {
		return <div>User "{params.username}" not found</div>
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
