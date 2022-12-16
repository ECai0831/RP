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

// --------------------- Get reference values -----------------------------
let userLink = document.getElementById("userLink");
let signOutLink = document.getElementById("signOut");
let welcome = document.getElementById("welcome");
let currentUser = null;

// ----------------------- Get User's Name'Name ------------------------------
function getUsername() {
	//grab value for key logged in switch
	let keeptLoggedIn = localStorage.getItem("keepLoggedIn");

	if (keeptLoggedIn == "yes") {
		currentUser = JSON.parse(localStorage.getItem("user"));
	} else {
		currentUser = JSON.parse(sessionStorage.getItem("user"));
	}

	currentUser = currentUser.accountInfo;
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser() {
	// Clear session and localStorage
	sessionStorage.removeItem("user");
	localStorage.removeItem("user");
	localStorage.removeItem("keepLoggedIn");

	signOut(auth)
		.then(() => alert("Sign out successful"))
		.catch((error) => alert(`Error: ${error.code} - ${error.message}`));
}

// ------------------------Set (insert) data into FRD ------------------------
function setData(year, month, day, temp, userID) {
	// Set the data
	set(ref(db, `users/${userID}/data/${year}/${month}`), {
		[day]: temp,
	})
		.then(() => {
			alert("Data saved successfully!");
		})
		.catch((error) => {
			alert(`Error: ${error.code} - ${error.message}`);
		});
}

document.getElementById("set").onclick = function () {
	const year = document.getElementById("year").value;
	const month = document.getElementById("month").value;
	const day = document.getElementById("day").value;
	const temp = document.getElementById("temperature").value;
	const userID = currentUser.uid;

	setData(year, month, day, temp, userID);
};

// -------------------------Update data in database --------------------------
function updateData(year, month, day, temp, userID) {
	// Set the data
	update(ref(db, `users/${userID}/data/${year}/${month}`), {
		[day]: temp,
	})
		.then(() => {
			alert("Data updated successfully!");
		})
		.catch((error) => {
			alert(`Error: ${error.code} - ${error.message}`);
		});
}

document.getElementById("update").onclick = function () {
	const year = document.getElementById("year").value;
	const month = document.getElementById("month").value;
	const day = document.getElementById("day").value;
	const temp = document.getElementById("temperature").value;
	const userID = currentUser.uid;

	updateData(year, month, day, temp, userID);
};

// ----------------------Get a datum from FRD (single data point)---------------

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph

// Add a item to the table of data

// -------------------------Delete a day's data from FRD ---------------------

// --------------------------- Home Page Loading -----------------------------

window.onload = function () {
	getUsername();

	if (currentUser == null) {
		userLink.innerText = "Create New Account";
		userLink.classList.replace("nav-link", "btn");
		userLink.classList.add("btn-primary");
		userLink.href = "register.html";

		signOutLink.innerText = "Sign In";
		signOutLink.classList.replace("nav-link", "btn");
		signOutLink.classList.add("btn-success");
		signOutLink.href = "signIn.html";
	} else {
		console.log(currentUser);

		userLink.innerText = currentUser.firstName;
		welcome.innerText = "Welcome, " + currentUser.firstName;
		userLink.classList.replace("btn", "nav-link");
		userLink.classList.add("btn-primary");
		userLink.href = "#";

		signOutLink.innerText = "Sign Out";
		signOutLink.classList.replace("btn", "nav-link");
		signOutLink.classList.add("btn-success");
		signOutLink.addEventListener("click", (e) => {
			e.preventDefault();
			signOutUser();
		});
	}
};

// ------------------------- Set Welcome Message -------------------------

// Get, Set, Update, Delete Sharkriver Temp. Data in FRD
// Set (Insert) data function call

// Update data function call

// Get a datum function call
function getDatum(userID, year, month, day) {
	// Get the data
	let yearVal = document.getElementById("yearVal");
	let monthVal = document.getElementById("monthVal");
	let dayVal = document.getElementById("dayVal");
	let tempVal = document.getElementById("tempVal");

	const dbref = ref(db);

	get(child(dbref, `users/${userID}/data/${year}/${month}/${day}`))
		.then((snapshot) => {
			if (snapshot.exists()) {
				yearVal.textContent = year;
				monthVal.textContent = month;
				dayVal.textContent = day;
				tempVal.textContent = snapshot.val();
			} else {
				alert("No data available");
			}
		})
		.catch((error) => {
			alert(`Error: ${error.code} - ${error.message}`);
		});
}

document.getElementById("get").onclick = function () {
	const year = document.getElementById("getYear").value;
	const month = document.getElementById("getMonth").value;
	const day = document.getElementById("getDay").value;

	getDatum(currentUser.uid, year, month, day);
}

// Get a data set function call

// Delete a single day's data function call
