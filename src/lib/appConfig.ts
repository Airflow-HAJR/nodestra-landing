const DEFAULT_SIGN_IN_PAGE = 'https://signin.nodestra.com'

export const SIGN_IN_PAGE_URL =
  (import.meta.env?.VITE_SIGN_IN_PAGE as string | undefined) ?? DEFAULT_SIGN_IN_PAGE
