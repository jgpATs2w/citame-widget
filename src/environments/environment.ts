// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API_URL: 'http://localhost/citame-api',// 'assets/',
  firebase: {
    apiKey: "AIzaSyARlCCs4vlQtPyDM8ZbBzAJQqDvFq4zs6w",
    authDomain: "booking-f87b3.firebaseapp.com",
    databaseURL: "https://booking-f87b3.firebaseio.com",
    projectId: "booking-f87b3",
    storageBucket: "booking-f87b3.appspot.com",
    messagingSenderId: "176977266320"
  }
};
