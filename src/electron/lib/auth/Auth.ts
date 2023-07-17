import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

export class BlixAuth {
  private app: FirebaseApp;
  private auth: Auth;
  private firebaseConfig = {
    // Set up env variables for this
  };

  constructor() {
    this.app = initializeApp(this.firebaseConfig);
    this.auth = getAuth(this.app);
  }

  public createUser(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        // TODO: Update frontend store
        const user = userCredential.user;
      })
      .catch((error) => {
        // TODO: Display error message
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  public login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        // TODO: Update frontend store
        const user = userCredential.user;
      })
      .catch((error) => {
        // TODO: Display error message
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
}
