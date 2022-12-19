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
  apiKey: "AIzaSyBg2zApspKowyOwlIuz7voq2549cgjbIQw",
  authDomain: "fir-intro-demo.firebaseapp.com",
  databaseURL: "https://fir-intro-demo-default-rtdb.firebaseio.com",
  projectId: "fir-intro-demo",
  storageBucket: "fir-intro-demo.appspot.com",
  messagingSenderId: "491851960615",
  appId: "1:491851960615:web:d69b821b480f13b4f35902"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

///initialize authentication
const auth = getAuth();

//initialize database
const db = getDatabase();

// ---------------- Register New User --------------------------------//
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
