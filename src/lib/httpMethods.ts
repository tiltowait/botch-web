import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

export const sendPost = async <T>(
  url: string,
  data: T,
  errorText: string | null = null,
): Promise<Response> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(errorText ?? `HTTP error! Status: ${response.status}`)
    }

    return response

  } catch (error) {
    console.error(`Error in POST to ${url}:`, error)
    throw error
  }
}

export const sendProxiedPost = async <T>(
  path: string,
  body: T,
  errorText: string | null = null,
): Promise<Response> => {
  return sendPost<{path: string, body: T, errorText: string | null}>(
    '/api/proxy',
    { path, body, errorText }
  )
}

export const generateUrl = (token: string, path: string): string => {
  let domain: string
  if (env.PUBLIC_TESTING) {
    domain = 'localhost:8000'
  } else {
    const idx = token.indexOf('_') // Presence is guaranteed
    if (idx === -1) {
      throw error(404, 'Malformed token.')
    }
    domain = token.substring(0, idx)
  }
  return `http://${domain}${path}`
}
