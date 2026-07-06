// A small shared helper so both services extract errors and build URLs the same way.

const RAW_STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string

if (!RAW_STRAPI_URL) {
  // Fail loudly at boot rather than producing confusing "//upload" URLs at runtime.
  // eslint-disable-next-line no-console
  console.error('VITE_STRAPI_URL is not set — API calls will fail.')
}

// Normalize away a trailing slash so callers can always do `${STRAPI_URL}/path`.
export const STRAPI_URL = (RAW_STRAPI_URL || '').replace(/\/+$/, '')

/**
 * Extracts a human-readable message from either:
 * - a Strapi HTTP error (an Error whose `.response` is a Response object), or
 * - a plain JS/network error.
 * Always resolves to a string; never throws.
 */
export async function extractErrorMessage(error: unknown, fallback = 'Something went wrong.'): Promise<string> {
  if (!error) return fallback

  const maybeResponse = (error as { response?: Response }).response

  if (maybeResponse instanceof Response) {
    try {
      // clone() so we don't consume a body some other code might still need to read
      const json = await maybeResponse.clone().json()
      return json?.error?.message || fallback
    } catch {
      return fallback
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

/** Thin wrapper around fetch that throws a consistent Error with a readable message. */
export async function fetchJson<T>(
  path: string,
  init: RequestInit = {},
  fallbackMessage = 'Request failed.'
): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`, init)

  if (!res.ok) {
    const message = await extractErrorMessage({ response: res }, fallbackMessage)
    throw new Error(message)
  }

  return res.json() as Promise<T>
}