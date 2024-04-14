import './resident_login.css';
import './security_login.css';
import './resident_signup.css';
import './visitor_signup.css';

import { AuthErrorCodes } from 'firebase/auth';



const txtPhoto = document.querySelector('#txtPhoto')

const txtMasterPassword = document.querySelector('#txtMasterPassword')

const qr_image = document.querySelector('#qr_image')
const qr_image_login = document.querySelector('#qr_image_login')

const btnLogin = document.querySelector('#btnLogin')
const btnSignupLogin = document.querySelector('#btnSignup_login')

const btnSignup = document.querySelector('#btnSignup')

const btnLogout = document.querySelector('#btnLogout')

const btn_security_login = document.querySelector('#btn_security_login')
const security_logout = document.querySelector('#security_logout')
const btnscanner = document.querySelector('#btnscanner')

const visitorEmail = document.getElementById('visitorEmail')
const visitorPass = document.getElementById('visitorPass')
const expiryTime = document.getElementById('expiryTime')
const btnVisitorSignup = document.querySelector('#btnVisitorSignup')

const divAuthState = document.querySelector('#divAuthState')
const lblAuthState = document.querySelector('#lblAuthState')

const divLoginError = document.querySelector('#divLoginError')
const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage')

const securitylogin = document.querySelector('#securitylogin')
const security_app = document.querySelector('#security_app')

const login = document.querySelector('#login')
const appLogin = document.querySelector('#app')

const app_signup = document.querySelector('#app_signup')
const signup = document.querySelector('#signup')

const visitorSignupPage = document.getElementById('visitorSignupPage')
const visitorApp = document.getElementById('visitorApp')
const visitorEntry = document.getElementById('visitorEntry')
const visitorExit = document.getElementById('visitorExit')
const visitorqr = document.getElementById('visitorqr')

const showLoginForm = () => {
  login.style.display = 'block'
  appLogin.style.display = 'none'
}

const showSignUpForm = () => {
  signup.style.display = 'block'
  app_signup.style.display = 'none'
}

const showSecurityForm = () => {
  securitylogin.style.display = 'block'
  security_app.style.display = 'none'
}

const showApp_Security = () => {
  securitylogin.style.display = 'none';
  security_app.style.display = 'block';
}

const showVisitorForm = () => {
  visitorSignupPage.style.display = 'block'
  visitorApp.style.display = 'none'
}

const showApp_Visitor = () => {
  visitorSignupPage.style.display = 'none';
  visitorApp.style.display = 'block';
}

const showApp_signup = () => {
  signup.style.display = 'none'
  app_signup.style.display = 'block'
}

const showApp = () => {
  login.style.display = 'none'
  app.style.display = 'block'
}

const hideLoginError = () => {
  divLoginError.style.display = 'none'
  lblLoginErrorMessage.innerHTML = ''
}

const showLoginError = (error) => {
  divLoginError.style.display = 'block'
  if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`
  }
  else {
    lblLoginErrorMessage.innerHTML = `Error: ${error.message}`
  }
}

const showLoginState = (user) => {
  lblAuthState.innerHTML = `You're logged in as ${user.displayName} (email: ${user.email}) `
}

hideLoginError()


import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc, getDocs, getDoc, addDoc, collection, Timestamp, query, where } from "firebase/firestore";


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
const db = getFirestore(app);


const generateqr = (uid) => {
  const qr_link = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${uid}`
  return qr_link
}

const createAccount = async () => {
  const photo = txtPhoto.files[0];

  if (photo !== undefined) {
    console.log("valid photo");
    await signInWithRedirect(auth, new GoogleAuthProvider());
    return photo
  } else {
    const error = { "message": "select valid photo" }
    showLoginError(error);
  }
  return photo;


}

const make_document = async (user, qr, base64) => {
  console.log("data created");
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    displayName: user.displayName,
    qr: qr,
    email: user.email,
    img: base64,
    userType: "resident"
  }, { merge: true }
  );
}

const monitorAuthStateSignUp = async () => {
  onAuthStateChanged(auth, async user => {
    hideLoginError()

    if (user) {


      const regex = /^[a-zA-Z0-9._%+-]+@iitgn\.ac\.in$/;
      console.log(user)

      if (regex.test(user.email)) {
        try {
          const qr = generateqr(user.uid);
          console.log(qr);
          qr_image.src = qr;

          showApp_signup()
          showLoginState(user)
          hideLoginError()

          const uploadedPhoto = await createAccount();
          const reader = new FileReader();
          let base64 = null;
          reader.onloadend = function () {
            base64 = reader.result
            console.log('RESULT', reader.result);
            make_document(user, qr, base64);
          }
          console.log(uploadedPhoto);
          reader.readAsDataURL(uploadedPhoto);
        }
        catch (error) {
          console.log(`There was an error: ${error}`);
          showLoginError(error);
        }

      } else {
        const error = { "message": "Make sure to use an iitgn mail address" }
        showLoginError(error);
        lblAuthState.innerHTML = `You're not logged in.`
        showSignUpForm()
      }


    }
    else {
      showSignUpForm()
      lblAuthState.innerHTML = `You're not logged in.`
    }
  })
}





const createAccountVisitor = async () => {
  const email = visitorEmail.value
  const password = visitorPass.value
  expiryTime.innerText = visitorExit.value
  const entryTime = visitorEntry.value
  const exitTime = visitorExit.value
  const userType = "visitor"
  const expiry = 0


  const EntrydateObject = new Date(entryTime);
  const EntryfirestoreTimestamp = Timestamp.fromDate(EntrydateObject);

  const ExitdateObject = new Date(exitTime);
  const ExitfirestoreTimestamp = Timestamp.fromDate(ExitdateObject);


  try {
    await createUserWithEmailAndPassword(auth, email, password)


    const visitorDocRef = await addDoc(collection(db, "users"), {
      email: email,
      password: password,
      entryTime: EntryfirestoreTimestamp,
      exitTime: ExitfirestoreTimestamp,
      userType: userType,
      expiry: expiry
    });



    console.log("Document written with ID: ", visitorDocRef.id);

    const qr = generateqr(visitorDocRef.id);

    visitorqr.setAttribute('src', qr)


    const timeDocRef = await addDoc(collection(db, "logs"), {
      uid: visitorDocRef.id,
      entryTime: EntryfirestoreTimestamp,
      exitTime: ExitfirestoreTimestamp,
      expiry: expiry
    })

    await setDoc(doc(db, "users", visitorDocRef.id), {
      qr: qr
    }, { merge: true }
    );

  }
  catch (error) {
    console.log(`There was an error: ${error}`)

    if (error.message === "Firebase: Error (auth/email-already-in-use).") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log("signed In")
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
    showLoginError(error)
  }

}

const monitorAuthStateVisitor = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      console.log(user)
      showApp_Visitor()

      showLoginState(user)
      hideLoginError()
    }
    else {
      showVisitorForm()
      lblAuthState.innerHTML = `You're not logged in.`
    }
  })
}

if (btnVisitorSignup !== null) {
  console.log('hi')
  btnVisitorSignup.addEventListener('click', createAccountVisitor)
  monitorAuthStateVisitor()
}

const securityLogIn = async () => {
  console.log('yo');
  const password = txtMasterPassword.value;
  console.log(password)
  if (password === "admin123") {
    showApp_Security()
    showLoginState(user)
    hideLoginError()

  } else {
    const error = { "message": "password invalid" }
    showLoginError(error);
    lblAuthState.innerHTML = `Invalid Master password`
    showSecurityForm()
  }
}

const securityLogOut = async () => {
  console.log("logged out security")
  showSecurityForm()
  hideLoginError()
}


const loginEmailPassword = async () => {
  console.log("b");
  await signInWithRedirect(auth, new GoogleAuthProvider());
}

const monitorAuthStateLogIn = async () => {
  onAuthStateChanged(auth, async user => {
    hideLoginError()

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const regex = /^[a-zA-Z0-9._%+-]+@iitgn\.ac\.in$/;
        console.log(user)
        if (regex.test(user.email)) {
          try {
            const qr = generateqr(user.uid);
            console.log(qr);
            qr_image_login.src = qr;
            showApp()
            showLoginState(user)
            hideLoginError()

          } catch (error) {
            console.log(`There was an error: ${error}`);
            showLoginError(error);
          }
        } else {
          const error = { "message": "Make sure to use an iitgn mail address" }
          showLoginError(error);
          lblAuthState.innerHTML = `You're not logged in.`
          showLoginForm()

        }

      } else {
        console.log("No such document!");
        window.location.href = './resident_signup.html'
        alert("please signup before logging in")
      }

    } else {
      showLoginForm()
      lblAuthState.innerHTML = `You're not logged in.`
    }
  })
}


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

if (btnSignup !== null) {
  btnSignup.addEventListener("click", createAccount)
  monitorAuthStateSignUp()
}



if (btn_security_login !== null) {
  showSecurityForm()
  btn_security_login.addEventListener("click", securityLogIn)
}

if (security_logout !== null) {
  security_logout.addEventListener('click', securityLogOut)
}


if (btnLogout !== null) {
  btnLogout.addEventListener("click", logout)

}



import { Html5QrcodeScanner } from "html5-qrcode";

const getInfroFromId = async (uid) => {
  console.log("inside")
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    const data = docSnap.data();
    alert(`Username: ${data.displayName}, email:${data.email}`)

    if (data.userType === "visitor") {
      console.log("visitor")
      console.log(typeof data.expiry)
      if (data.expiry == 0) {
        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, { expiry: 1 }, { merge: true });
      } else if (data.expiry == 1) {
        alert("QR code expired. Thx for visiting!")
        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, { expiry: 2 }, { merge: true });
      }
    }


  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

function onScanSuccess(decodedText, decodedResult) {
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${decodedText}`, decodedResult);
  const uid = decodedText;
  getInfroFromId(uid);

}

function onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.warn(`Code scan error = ${error}`);
}


// decodedText
const scanner = () => {
  console.log("scnnaer")
  let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false);
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}
if (btnscanner !== null) {
  btnscanner.addEventListener('click', scanner)
}

setInterval(async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where('exitTime', "<=", Timestamp.now()));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((user) => {
    
    console.log(user.id, " => ", user.data());
  });

  console.log("hi in 10s")

}, 10000)


