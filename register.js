// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import {
	getDatabase,
	ref,
	set,
	update,
	child,
	get,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEVE-SXtl_CEMLEuDTRkfOPU7Wo4Nxr08",
  authDomain: "research-website-1a6ab.firebaseapp.com",
  databaseURL: "https://research-website-1a6ab-default-rtdb.firebaseio.com",
  projectId: "research-website-1a6ab",
  storageBucket: "research-website-1a6ab.appspot.com",
  messagingSenderId: "298521542381",
  appId: "1:298521542381:web:efe159951d66ed1c2996e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

///initialize authentication
const auth = getAuth();

//initialize database
const db = getDatabase();

// ---------------- Register New Uswer --------------------------------//
document.getElementById("submitData").onclick = function () {
	// Get the values from the form
	var email = document.getElementById("userEmail").value;
	var password = document.getElementById("userPass").value;
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;

	if (!validation(firstName, lastName, email, password)) {
		return;
	}

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;

			// Add user to database
			set(ref(db, "users/" + user.uid + "/accountInfo"), {
				uid: user.uid, // save userID for home.js reference
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: encryptPass(password),
			});
			// ...
			alert("Registration Successful!");
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			// ..
			alert(`Error: ${errorCode} - ${errorMessage}`);
		});
};

// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str) {
	return str === null || str.match(/^ *$/) !== null;
}

// ---------------------- Validate Registration Data -----------------------//
function validation(fName, lName, email, pWord) {
	let nameRegex = /^[a-zA-Z]+$/;
	let emailRegex = /^\w+@ctemc\.org$/;

	if (
		isEmptyorSpaces(fName) ||
		isEmptyorSpaces(lName) ||
		isEmptyorSpaces(email) ||
		isEmptyorSpaces(pWord)
	) {
		alert("Please enter all the required information.");
		return false;
	}

	if (
		!fName.match(nameRegex) ||
		!lName.match(nameRegex) ||
		!email.match(emailRegex)
	) {
		alert("Please enter valid inputs.");
		return false;
	}

	return true;
}

// --------------- Password Encryption -------------------------------------//
function encryptPass(password) {
	let encrypted = CryptoJS.AES.encrypt(password, password);
	return encrypted.toString();
}

function decryptPass(password) {
	let decrypted = CryptoJS.AES.decrypt(password, password);
	return decrypted.toString();
}
