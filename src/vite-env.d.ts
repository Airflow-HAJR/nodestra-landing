/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_EMAIL: string
  readonly VITE_MAPBUILDER_URL: string
  readonly VITE_GATEGETTER_URL: string
  readonly VITE_SIGN_IN_PAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
