import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import { PUBLIC_BOTCH_API_URL } from '$env/static/public'
import { sendPost } from '$lib/httpMethods'

export const POST: RequestHandler = async ({ request }) => {
  const { path, body, errorText } = await request.json()

  try {
    const fullUrl = `${path}`
    const response = await sendPost(fullUrl, body, errorText)
    const data = await response.json()
    return json(data)
  } catch (error) {
    console.error('Error proxying request:', error)
    return json({ error: 'Failed to proxy request' }, { status: 500 })
  }
}
