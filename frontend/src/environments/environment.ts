// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Para desenvolvimento local, use variáveis de ambiente vazias ou de teste
// As variáveis reais serão injetadas durante o build pelo Angular CLI
export const environment = {
  production: false,
  useEmulators: false,
  apiUrl: 'http://localhost:3000/api',
  graphqlUrl: 'http://localhost:4000/graphql',
  firebase: {
    apiKey: "AIzaSyBIFBiPZqegXg9_rlmhA3TvwiCsYmgUTno",
    authDomain: "kanban-board-bbf3b.firebaseapp.com",
    projectId: "kanban-board-bbf3b",
    storageBucket: "kanban-board-bbf3b.appspot.com",
    messagingSenderId: "347147579688",
    appId: "1:347147579688:web:f80a0a269d2ed8a680201d",
    measurementId: "G-BGWP5N6DHC"
  }
}; 