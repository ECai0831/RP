// This JS file is for signing in a user ---------------------------//

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

// ---------------------- Sign-In User ---------------------------------------//
document.getElementById("signIn").onclick = function () {
	// Get the values from the form
	var email = document.getElementById("loginEmail").value;
	var password = document.getElementById("loginPassword").value;

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			// ...
			//log sign in date in databse
			//update will only add the last_login
			let logDate = new Date();
			update(ref(db, "users/" + user.uid + "/accountInfo"), {
				last_login: logDate,
			}).then(() => {
				alert("Signed in successfully!");

				//get snapshot of all user info and pass it to the login() function
				get(ref(db, "users/" + user.uid)).then((snapshot) => {
					if (snapshot.exists()) {
						console.log(snapshot.val());
						logIn(snapshot.val());
					} else {
						console.log("No data available");
					}
				});
			});
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			alert(errorMessage);
		});
};

// ---------------- Keep User Logged In ----------------------------------//
function logIn(user) {
	let keepLoggedIn = document.getElementById("keepLoggedInSwitch").checked;

	if (!keepLoggedIn) {
		sessionStorage.setItem("user", JSON.stringify(user));
		alert("Wawaweewa");
		window.location = "home.html";
	} else {
		localStorage.setItem("keepLoggedIn", "yes");
		localStorage.setItem("user", JSON.stringify(user));
		alert("Account will be kept logged in.");
		window.location = "home.html";
	}
}
