import './resident_login.css';
import {
  hideLoginError,
  showLoginState,
  showLoginForm,
  showApp,
  btnSignup,
  showLoginError,
  btnLogin,
  btnLogout,
  btnSignupLogin,
  txtPhoto,
  showSignUpForm,
  showApp_signup
} from './ui'




import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  connectAuthEmulator
} from 'firebase/auth';

import { getFirestore, collection, CollectionReference, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtpTqGklsYMr0QNXQdrsglr53UlLArX2U",
  authDomain: "e-gate-75e30.firebaseapp.com",
  projectId: "e-gate-75e30",
  storageBucket: "e-gate-75e30.appspot.com",
  messagingSenderId: "332636384111",
  appId: "1:332636384111:web:d22a8868779ed8c44c169a",
  measurementId: "G-5FCZJEHH  WM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099");


const generateqr = (uid)=>{
    const qr_link = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${uid}`
    return qr_link
}


// Login using email/password
const loginEmailPassword = async () => {
  console.log("b");
  user = await signInWithRedirect(auth, new GoogleAuthProvider());

  // if user not in db promt to signup

  try {
    const userDetails = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    console.log(userDetails.user);
  }
  catch (error) {
    console.log(`There was an error: ${error}`);
    showLoginError(error);
  }
}

// // Create new account using email/password
const createAccount = async () => {
  console.log("hi");
  
  const photo = txtPhoto.files[0];
  // console.log(photo.value)
  if(photo !== undefined){
    console.log("valid photo");
    await signInWithRedirect(auth, new GoogleAuthProvider());
  }else{
    const error = {"message": "select valid photo"}
    showLoginError(error);

  }
}

// // Monitor auth state
const monitorAuthStateSignUp = async () => {
  onAuthStateChanged(auth, user => {
    hideLoginError()

    if (user) {
      const regex = /^[a-zA-Z0-9._%+-]+@iitgn\.ac\.in$/;
      console.log(user)

      if (regex.test(user.email)){
        try {
          showApp_signup()
          showLoginState(user)
          hideLoginError()


          // generate permanent qr code for uid
          // const qr = generateqr(user.uid);
          // console.log(qr);

          // update the fields in db
          // const {uid, displayName, email} = user; 

          // show the UI -> qr code
        }
        catch(error) {
          console.log(`There was an error: ${error}`);
          showLoginError(error);
        } 
      }else{
        const error = {"message": "Make sure to use an iitgn mail address"}
        showLoginError(error);
        lblAuthState.innerHTML = `You're not logged in.`
        showSignUpForm()
        
      }
      // hideLinkError()
    }
    else {
      // showLoginForm()
      showSignUpForm()
      lblAuthState.innerHTML = `You're not logged in.`
    }
  })
}

const monitorAuthStateLogIn = async () => {
  onAuthStateChanged(auth, user => {
    hideLoginError()

    if (user) {
      const regex = /^[a-zA-Z0-9._%+-]+@iitgn\.ac\.in$/;
      console.log(user)

      if (regex.test(user.email)){
        try {
          showApp()
          showLoginState(user)
          hideLoginError()


          // generate permanent qr code for uid
          // const qr = generateqr(user.uid);
          // console.log(qr);

          // update the fields in db
          // const {uid, displayName, email} = user; 

          // show the UI -> qr code
        }
        catch(error) {
          console.log(`There was an error: ${error}`);
          showLoginError(error);
        } 
      }else{
        const error = {"message": "Make sure to use an iitgn mail address"}
        showLoginError(error);
        lblAuthState.innerHTML = `You're not logged in.`
        showLoginForm()
        
      }
      // hideLinkError()
    }
    else {
      // showLoginForm()
      showLoginForm()
      lblAuthState.innerHTML = `You're not logged in.`
    }
  })

}


// Log out
const logout = async () => {
  await signOut(auth);
}

if (btnLogin !== null) {
  btnLogin.addEventListener("click", loginEmailPassword)

  btnSignupLogin.addEventListener("click", () => {
    location.href = "./resident_signup.html"
  });

  monitorAuthStateLogIn()
}

if(btnSignup !== null){
  btnSignup.addEventListener("click", createAccount)
  monitorAuthStateSignUp()
}

btnLogout.addEventListener("click", logout)



// monitorAuthState();

