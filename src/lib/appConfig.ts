const DEFAULT_SIGN_IN_PAGE = 'https://signin.nodestra.com'

function normalizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

export const SIGN_IN_PAGE_URL = normalizeUrl(
  (import.meta.env?.VITE_SIGN_IN_PAGE as string | undefined) ?? DEFAULT_SIGN_IN_PAGE
)
