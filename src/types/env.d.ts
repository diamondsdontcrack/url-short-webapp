declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      /**
       * This a base URL that the apllication will use to communicate to the server
       */
      REACT_APP_API_BASE_URL: string
    }
  }
}

export {}