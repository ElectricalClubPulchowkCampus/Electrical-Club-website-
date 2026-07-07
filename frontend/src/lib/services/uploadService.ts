import { STRAPI_URL } from '../httphelper'

export interface StrapiUploadFile {
  id: number
  url: string
  name: string
  mime: string
  size: number
}

export const UploadService = {
  /**
   * Uploads a single file to Strapi's /upload endpoint.
   * Returns the uploaded file's id (needed to link it to a media relation field,
   * e.g. `payment`, when creating another entry) and its absolute URL.
   * Returns null only if the caller passes no file.
   */
  async uploadFile(
    file: File,
    opts: { signal?: AbortSignal } = {}
  ): Promise<{ id: number; url: string } | null> {
    if (!file) return null

    const formData = new FormData()
    formData.append('files', file)

    let res: Response
    try {
      res = await fetch(`${STRAPI_URL}/upload`, {
        method: 'POST',
        body: formData,
        signal: opts.signal,
      })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
      throw new Error('Could not reach the server to upload the file. Check your connection.')
    }

    if (!res.ok) {
      // Try to surface Strapi's actual error message rather than a generic one.
      let message = 'File upload failed.'
      try {
        const json = await res.clone().json()
        message = json?.error?.message || message
      } catch {
        // response wasn't JSON — fall back to generic message
      }
      throw new Error(message)
    }

    let data: StrapiUploadFile[]
    try {
      data = await res.json()
    } catch {
      throw new Error('Upload succeeded but the server response could not be read.')
    }

    const uploaded = data?.[0]
    if (!uploaded?.url || uploaded?.id == null) {
      throw new Error('Upload succeeded but no file id/URL was returned.')
    }
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string 

    return { id: uploaded.id, url: `${BACKEND_URL}${uploaded.url}` }
  },
}